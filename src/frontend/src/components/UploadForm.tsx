import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Button,
    Grid,
    FormControl,
    Paper,
    TextField,
    Typography,
    Container,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import {apiClient} from "../api/axios.ts";

interface FormData {
    file: File | null;
    fileName: string;
    chunkSize: number | undefined;
    chunkOverlap: number | undefined;
    isSeparatorRegex: boolean;
}

const UploadForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        file: null,
        fileName: '',
        chunkSize: undefined,
        chunkOverlap: undefined,
        isSeparatorRegex: false,
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;

        setFormData({
            ...formData,
            file: selectedFile,
            fileName: selectedFile ? selectedFile.name : '',
        });
    };

    const handleNumericInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof FormData
    ) => {
        const numericValue = event.target.value.replace(/\D/g, '');
        setFormData({ ...formData, [field]: numericValue });
    };

    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, isSeparatorRegex: event.target.value === 'true' });
    };

    const handleFileClear = () => {
        setFormData({
            ...formData,
            file: null,
            fileName: '',
        });
    };

    const handleSubmit = (event: FormEvent) => {
        if (!formData.file) return
        event.preventDefault();
        apiClient.upload(formData.file, formData.chunkSize, formData.chunkOverlap, formData.isSeparatorRegex).then(() => console.log('done'))
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                <Typography variant="h5" align="center" style={{ marginBottom: 20 }}>
                    Upload Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <input
                                    type="file"
                                    id="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="file">
                                    <Button component="span" variant="outlined" fullWidth>
                                        Choose File
                                    </Button>
                                </label>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            {formData.fileName && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="body1" style={{ marginRight: 8, textAlign: 'center' }}>
                                        Selected File: {formData.fileName}
                                    </Typography>
                                    <DeleteIcon fontSize="small" color="error" onClick={handleFileClear}/>
                                </div>
                            )}
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Chunk Size"
                                type="number"
                                id="chunkSize"
                                value={formData.chunkSize}
                                onChange={(e) => handleNumericInputChange(e, 'chunkSize')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Chunk Overlap"
                                type="number"
                                id="chunkOverlap"
                                value={formData.chunkOverlap}
                                onChange={(e) => handleNumericInputChange(e, 'chunkOverlap')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item xs={12} sm={4} md={4}>
                                    <Typography variant="subtitle1" textAlign="left">Separator Regex:</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8}>
                                    <RadioGroup
                                        row
                                        aria-label="isSeparatorRegex"
                                        name="isSeparatorRegex"
                                        value={formData.isSeparatorRegex.toString()}
                                        onChange={handleRadioChange}
                                    >
                                        <FormControlLabel
                                            value="true"
                                            control={<Radio />}
                                            label="True"
                                            style={{ marginRight: 16 }}
                                        />
                                        <FormControlLabel value="false" control={<Radio />} label="False" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default UploadForm;
