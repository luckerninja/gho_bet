
import ghoprdAbi from './abi/ghoprd.json'
import { useContractWrite } from 'wagmi'
import { Button, TextField, Box, Input } from '@mui/material'
import { useState } from 'react'

export default function MakePrediction() {

    const [text, setText] = useState("");
    const [date, setDate] = useState("")
    

    const { data, isError, isLoading, write } = useContractWrite({
        address: '0x1B88a8fef304Ea9413D7224c4Bb878E119A5F329',
        abi: ghoprdAbi,
        functionName: 'makePrediction',
    })
    
    return(
    <Box sx={{margin: '40px auto', width: '45%'}}> 
        <TextField
            value={text}
            label="Your prediction"
            onChange={(e) => {
                setText(e.target.value);
            }}
        /> 
        <Input 
            type='date' 
            value={date}
            onChange={(e) => {
                setDate(e.target.value);
            }}
            
        />
        <Button onClick={() => write({args: [text, new Date(date).getTime()]})}>Make prediction</Button>
    </Box>)
}