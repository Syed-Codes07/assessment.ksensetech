import axios from 'axios';

const API_KEY = 'ak_628c56f5c85d072ad97d69aec2b67af697816d2ec87398c2';
const BASE_URL = 'https://assessment.ksensetech.com/api';
const MAX_RETRIES = 3;
const LIMIT = 20;

type Patient = {
    patient_id: string;
    name?: string;
    age?: any;
    gender?: string;
    blood_pressure?: string;
    temperature?: any;
    visit_date?: string;
    diagnosis?: string;
    medications?: string;
};


async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<any> {
    try {
        const res = await axios.get(url, {
            headers: { 'x-api-key': API_KEY },
        });
        return res.data;
    } catch (err: any) {
        if (retries > 0 && [500, 503, 429].includes(err.response?.status)) {
            await new Promise((r) => setTimeout(r, 1000)); // backoff
            return fetchWithRetry(url, retries - 1);
        } else {
            throw err;
        }
    }
}


function parseBP(bp: string | undefined): number {
    if (!bp || typeof bp !== 'string') return 0;

    const match = bp.match(/^(\d{2,3})\/(\d{2,3})$/);
    if (!match) return 0;

    const [systolic, diastolic] = [parseInt(match[1]), parseInt(match[2])];
    if (isNaN(systolic) || isNaN(diastolic)) return 0;

    if (systolic >= 140 || diastolic >= 90) return 4;
    if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) return 3;
    if (systolic >= 120 && systolic <= 129 && diastolic < 80) return 2;
    if (systolic < 120 && diastolic < 80) return 1;
    return 0;
}

function parseTemp(temp: any): number {
    const t = parseFloat(temp);
    if (isNaN(t)) return 0;
    if (t >= 100.1) return 2;
    if (t >= 99.6) return 1;
    return 0;
}

function parseAge(age: any): number {
    const a = parseInt(age);
    if (isNaN(a)) return 0;
    if (a > 65) return 2;
    return 1;
}

function hasInvalidData(p: Patient): boolean {
    const bpValid = typeof p.blood_pressure === 'string' && /^\d{2,3}\/\d{2,3}$/.test(p.blood_pressure);
    const tempValid = !isNaN(parseFloat(p.temperature));
    const ageValid = !isNaN(parseInt(p.age));

    return !bpValid || !tempValid || !ageValid;
}


async function runAssessment() {
    let page = 1;
    let hasNext = true;

    const high_risk_patients: string[] = [];
    const fever_patients: string[] = [];
    const data_quality_issues: string[] = [];

    while (hasNext) {
        const url = `${BASE_URL}/patients?page=${page}&limit=${LIMIT}`;
        const response = await fetchWithRetry(url);

        const patients: Patient[] = response.data || [];

        patients.forEach((p) => {
            const bpScore = parseBP(p.blood_pressure);
            const tempScore = parseTemp(p.temperature);
            const ageScore = parseAge(p.age);

            const totalScore = bpScore + tempScore + ageScore;

            if (totalScore >= 4) high_risk_patients.push(p.patient_id);
            if (parseFloat(p.temperature) >= 99.6) fever_patients.push(p.patient_id);
            if (hasInvalidData(p)) data_quality_issues.push(p.patient_id);
        });

        hasNext = response.pagination?.hasNext;
        page++;
    }

    const result = {
        high_risk_patients,
        fever_patients,
        data_quality_issues,
    };

    console.log('Submitting results:', result);

    try {
        const submit = await axios.post(`${BASE_URL}/submit-assessment`, result, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
        });

        console.log('Submission response:', submit.data);
    } catch (err: any) {
        console.error('Submission failed:', err.response?.data || err.message);
    }
}

runAssessment();
