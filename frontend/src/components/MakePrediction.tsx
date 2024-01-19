
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
    <Box sx={{margin: '40px auto', width: '35%', backgroundColor: '#A095B5', borderRadius: '40px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '10px' }}> 
        <TextField
            value={text}
            InputProps={{
                disableUnderline: true
            }}
            variant='standard'
            label="Your prediction"
            sx={{ width: '99%', backgroundColor: '#F7F2FF', borderRadius: '40px', outline: 'none!important', padding: '10px', 'label': { 'left': '50px' }}}
            onChange={(e) => {
                setText(e.target.value);
            }}
        /> 
        <Input 
            type='date' 
            value={date}
            sx={{ margin: '10px', backgroundColor: '#E0D9EE', padding: '5px 20px', borderRadius: '20px', '&:before': { borderBottom: '0px!important' } }}
            onChange={(e) => {
                setDate(e.target.value);
            }}
            
        />
        <Button sx={{ margin: '10px', backgroundColor: '#E0D9EE', color: '#333333', padding: '5px 20px', borderRadius: '20px', '&:hover': { backgroundColor: '#E0D9EE' } }} onClick={() => write({args: [text, new Date(date).getTime() / 1000]})}>Make prediction</Button>
    </Box>)
}