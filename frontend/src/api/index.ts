import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('soria_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
  getKits: (code: string) => api.get(`/kits/domaine/${code}`).then(r => r.data),
};

export const kitsApi = {
  getByCode: (code: string) => api.get(`/kits/${code}`).then(r => r.data),
};

export const kitFichesApi = {
  getNiveau: (kitId: number, niveau: number) =>
    api.get(`/kit-fiches/${kitId}/niveau/${niveau}`).then(r => r.data),
  getOutils: (kitId: number) =>
    api.get(`/kit-outils/${kitId}`).then(r => r.data),
};

export const invitationsApi = {
  create: (email: string) =>
    api.post('/invitations', { email }).then(r => r.data),
  verify: (token: string) =>
    api.get(`/invitations/verify/${token}`).then(r => r.data),
  accept: (token: string, nom: string, prenom: string, password: string) =>
    api.post('/invitations/accept', { token, nom, prenom, password }).then(r => r.data),
  getAll: () =>
    api.get('/invitations').then(r => r.data),
};
