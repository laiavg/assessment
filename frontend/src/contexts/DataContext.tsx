import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import { Document } from '../api/types.ts'

interface DataProviderProps {
    children: ReactNode;
}

interface DataContextType {
    document: Document | undefined;
    updateDocument: Dispatch<SetStateAction<any>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [document, setDocument] = React.useState<Document>();

    const updateResponseData: DataContextType['updateDocument'] = (data) => {
        setDocument(data);
    };

    const contextValue: DataContextType = {
        document: document,
        updateDocument: updateResponseData,
    };

    return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
