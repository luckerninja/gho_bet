
import { useContractRead } from 'wagmi'
import ghoprdAbi from './abi/ghoprd.json'
import { Box, Button } from '@mui/material'

export default function PredictionList() {

    const { data, isError, isLoading } = useContractRead({
        address: '0x1B88a8fef304Ea9413D7224c4Bb878E119A5F329',
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