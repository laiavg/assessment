import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
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
    CircularProgress
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import {apiClient} from "../api/axios.ts";
import {useData} from "../contexts/DataContext.tsx";
import {useNavigate} from "react-router-dom";
import {TaskStatus} from "../api/types.ts";


interface FormData {
    file: File | null;
    fileName: string;
    chunkSize: string;
    chunkOverlap: string;
    isSeparatorRegex: string;
}

const UploadPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        file: null,
        fileName: '',
        chunkSize: '',
        chunkOverlap: '',
        isSeparatorRegex: 'false',
    });
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const navigate = useNavigate();
    const { updateDocument } = useData();

    useEffect(() => {
        const chunkSize = parseInt(formData.chunkSize || '0', 10);
        const chunkOverlap = parseInt(formData.chunkOverlap || '0', 10);

        if ((chunkSize !== 0 && chunkOverlap === 0) || (chunkSize === 0 && chunkOverlap !== 0)) {
            setErrorMessage("Size and overlap have to be either defined or left blank")
            setIsFormValid(false)
            return
        }

        if (chunkSize < chunkOverlap) {
            setErrorMessage("Chunk overlap cannot be larger than chunk size")
            setIsFormValid(false)
            return
        }

        setErrorMessage(null)
        setIsFormValid(true)
    }, [formData.chunkSize, formData.chunkOverlap])

    const setFile = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setFormData({...formData, file: selectedFile, fileName: selectedFile ? selectedFile.name : ''});
    };

    const setInputField = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof FormData
    ) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const setRadioField = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, isSeparatorRegex: event.target.value });
    };

    const removeFile = () => {
        setFormData({...formData, file: null, fileName: ''});
    };

    const submitForm = (event: FormEvent) => {
        event.preventDefault()
        setErrorMessage(null)
        if (!formData.file) return
        if (!isFormValid) return
        setIsLoading(true)
        apiClient.upload(formData.file, formData.chunkSize, formData.chunkOverlap, formData.isSeparatorRegex)
            .then(response => getTaskResult(response.task_id))
            .catch(() => {
                setErrorMessage("Form could not be submitted")
                setIsLoading(false)
            })
    };

    const stopPolling = (interval: number) => {
        clearInterval(interval)
        setIsLoading(false)
    }

    const getTaskResult = (task_id: string) => {
        const interval = setInterval(() => {
            apiClient.getTask(task_id)
                .then(response => {
                    const taskStatus = response.task_status
                    if (taskStatus === TaskStatus.SUCCESS) {
                        updateDocument(response.task_result)
                        stopPolling(interval)
                        navigate('/results');
                    }
                    else if (taskStatus === TaskStatus.FAILURE || taskStatus === TaskStatus.REVOKED) {
                        stopPolling(interval)
                    }
                })
                .catch(() => {
                    setErrorMessage("The petition could not be processed");
                    stopPolling(interval)
                });
        }, 2000);
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                <Typography variant="h5" align="center" style={{ marginBottom: 20 }}>
                    Upload Form
                </Typography>
                <form onSubmit={submitForm}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <input
                                    type="file"
                                    id="file"
                                    accept=".pdf"
                                    onChange={setFile}
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
                                    <DeleteIcon fontSize="small" color="error" onClick={removeFile}/>
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
                                onChange={(e) => setInputField(e, 'chunkSize')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Chunk Overlap"
                                type="number"
                                id="chunkOverlap"
                                value={formData.chunkOverlap}
                                onChange={(e) => setInputField(e, 'chunkOverlap')}
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
                                        onChange={setRadioField}
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
                            {errorMessage && (
                                <div style={{ color: 'red' }}>
                                    {errorMessage}
                                </div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary" fullWidth
                                disabled={isLoading || !formData.file || !isFormValid}
                            >
                                {isLoading ? <CircularProgress size={18} /> : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default UploadPage;
