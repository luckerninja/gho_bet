
import { useContractRead } from 'wagmi'
import ghoprdAbi from './abi/ghoprd.json'
import { Box, Button } from '@mui/material'

export default function PredictionList() {

    const { data, isError, isLoading } = useContractRead({
        address: '0xAC3bf4092B4c73B3c69bA0FFAAc22B8272c83ea6',
        abi: ghoprdAbi,
        functionName: 'getPredictions',
    })

    console.log(data)

    const predictions = data as any[]
    
    return(
    <Box sx={{margin: '40px auto', width: '45%'}}>
        {predictions.map((el) => {
            return (
                <>
                    {el.text}
                    <Button>Bet</Button>
                </>
            )
        })}
    </Box>
    )
}