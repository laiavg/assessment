import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Table, TableBody, TableRow, TableCell, TableContainer, TableHead, Typography, TablePagination } from '@mui/material';

const ResultsPage: React.FC = () => {
    const { document } = useData();
    const navigate = useNavigate();

    useEffect(() => {
        if (!document) navigate('/');
    }, [document, navigate]);

    return (
        <Container style={{ position: 'relative' }}>
            {document && <ChunkList document={document} />}
        </Container>
    );
};

const ChunkList = ({ document }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return (
        <Container>
            <Typography variant="h4">Chunk list</Typography>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Text</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {document.chunks.slice(startIndex, endIndex).map((chunk) => (
                            <TableRow key={chunk.id}>
                                <TableCell>{chunk.id}</TableCell>
                                <TableCell>{chunk.text}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={document.chunks.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </Container>
    );
};

export default ResultsPage;