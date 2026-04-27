import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
});

export const referentielApi = {
  getCategorie: (kitCode: string, categorie: string) =>
    api.get(`/referentiel/${kitCode}/${categorie}`).then(r => r.data),
};

export const moteurApi = {
  generer: (kitCode: string, dto: any) =>
    api.post(`/moteur/${kitCode}/generer`, dto).then(r => r.data),
};

export const domainesApi = {
  getAll: () => api.get('/domaines').then(r => r.data),
  getKits: (code: string) => api.get(`/kits/domaine/${code}`)
    .then(r => { console.log('API kits response:', r.data); return r.data; }),
};

export const kitsApi = {
  getByCode: (code: string) => api.get(`/kits/${code}`).then(r => r.data),
};
