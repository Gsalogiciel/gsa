import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetch = (url, params = {}, method = 'GET') => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (signal) => {
        try {
            setLoading(true);
            setError(null);

            // Gérer les paramètres pour les requêtes GET
            const config = {
                url,
                method,
                signal,
                ...(method === 'GET' ? { params } : { data: params }),
            };

            const response = await axios(config);
            setData(response.data);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request canceled:', err.message);
            } else {
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    }, [url, params, method]);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);

        return () => controller.abort(); // Cleanup pour annuler la requête en cours
    }, [fetchData]);

    // Fonction pour relancer la requête manuellement
    const refetch = () => fetchData();

    return { data, error, loading, refetch };
};

export default useFetch;
