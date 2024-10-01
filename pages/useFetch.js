import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url, params = {}, method = 'GET') => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios({
                    url,
                    method,
                    data: params,
                });
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, params, method]);

    return { data, error, loading };
};

export default useFetch;
