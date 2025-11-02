import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Query = () => {
    const numLocated = useLocation();
    const querySelected = numLocated.state?.querySelected;

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (querySelected) {
            const fetchQueryData = async () => {
                try {
                    setLoading(true);
                    setError(null);
                
                    const response = await fetch(`http://localhost:5000/api/query/${querySelected}`);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    setResults(data.info); 

                } catch (e) {
                    console.error("Failed to fetch data:", e);
                    setError(e.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchQueryData();
        } else {
            setLoading(false);
            setError("No query selected.");
        }
    }, [querySelected]); 


    if (loading) {
        return <h1>Loading results for query {querySelected}...</h1>;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }

    if (!results || results.length === 0) {
        return <h1>No results found for query {querySelected}.</h1>
    }

    return (
        <div>
            <div className='title_container'>
                <h1>Resultados {querySelected}</h1>
            </div>
                <div className="data_keys">
                                {Object.keys(results[0]).map((key, ind) => (
                                    <p key={ind} className="single_key">
                                        {key}
                                    </p>
                                ))}
                </div>
            {results.map((t, index)=> (
                <div className="data_div" key={index}>
                    {Object.values(t).map((data, i) => (
                        <div className="data_cont" key={i}>
                            <p key={i} className="single_data">
                                {data}
                            </p>
                        </div>
                     ))}
                </div>
            ))}
        </div>
    );
}

export default Query;