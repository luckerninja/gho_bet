
import { useContractRead, useContractWrite } from 'wagmi'
import ghoprdAbi from './abi/ghoprd.json'
import ghoAbi from './abi/gho.json'
import { Box, Button, Switch, Divider, Input, Typography, LinearProgress } from '@mui/material'

export default function PredictionList() {

    const WEI = 1000000000000000000;

    const { data, isError, isLoading } = useContractRead({
        address: '0x1B88a8fef304Ea9413D7224c4Bb878E119A5F329',
        abi: ghoprdAbi,
        functionName: 'getPredictions',
    })

    const { write: approveGHO } = useContractWrite({
        address: '0xcbE9771eD31e761b744D3cB9eF78A1f32DD99211',
        abi: ghoAbi,
        functionName: 'approve',
    })

    const { write: betOnPrediction } = useContractWrite({
        address: '0x1B88a8fef304Ea9413D7224c4Bb878E119A5F329',
        abi: ghoprdAbi,
        functionName: 'betOnPrediction',
    })

    console.log(data, 'predictions')

    const predictions = data as any[]
    
    return(
        <Box sx={{margin: '40px auto', width: '35%', backgroundColor: '#EBE3FA',  borderRadius: '40px'}}>
            {predictions && predictions.map((el) => {
                return (
                    <Box key={el?.predictionId} >
                        {el.text}
                        <Button sx={{ backgroundColor: '#A095B5', color: 'black', fontWeight: 'bold', borderRadius: '20px' }} onClick={async () => {
                            await approveGHO({args: ['0x1B88a8fef304Ea9413D7224c4Bb878E119A5F329', 1 * WEI]});
                            await betOnPrediction({args: [el?.predictionId, 1 * WEI, true]});
                        }}>bet on prediction</Button>
                        <Typography>{new Date(Number(el.endDate) * 1000).toISOString().slice(0, 10)}</Typography>
                        <Switch />
                        <Input value={0} type='number' sx={{ backgroundColor: '#F7F2FF', borderRadius: '20px', width: '55px', padding: '0 10px', '&:before': { borderBottom: '0px!important' } }} />
                        <LinearProgress variant="determinate"  value={50} sx={{ borderRadius: '10px', height: '20px' }} />
                        <Divider sx={{ height: '2px', backgroundColor: '#A095B5' }} />
                    </Box>
                )
            })}
        </Box>
    )
}