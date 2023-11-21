import React, {useEffect} from "react";
import {useData} from "../contexts/DataContext.tsx";
import {useNavigate} from "react-router-dom";

const Results: React.FC = () => {
    const { document } = useData();
    const navigate = useNavigate();

    useEffect(() => {
        if (!document) navigate('/');
    }, [document, navigate]);

    return <>
        {document &&
            <h1>{document.id}</h1>
        }
    </>
}

export default Results;