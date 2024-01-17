
import ghoprdAbi from './abi/ghoprd.json'
import { useContractWrite } from 'wagmi'
import { Button, TextField, Box } from '@mui/material'
import { useState } from 'react'

export default function MakePrediction() {

    const [name, setName] = useState("");

    const { data, isError, isLoading, write } = useContractWrite({
        address: '0x1B88a8fef304Ea9413D7224c4Bb878E119A5F329',
        abi: ghoprdAbi,
        functionName: 'makePrediction',
    })
    
    return(
    <Box sx={{margin: '40px auto', width: '45%'}}> 
        <TextField
            value={name}
            label="Your prediction"
            onChange={(e) => {
                setName(e.target.value);
            }}
        /> 
        <Button onClick={() => write({args: [name, 1709438758]})}>Make prediction</Button>
    </Box>)
}