
import { useContractRead, useContractWrite } from 'wagmi'
import ghoprdAbi from './abi/ghoprd.json'
import ghoAbi from './abi/gho.json'
import { Box, Button, Switch, Divider, Input, Typography, LinearProgress, Stack } from '@mui/material'
import { useState } from 'react'

export default function PredictionList() {

    const [outcome, setOutcome] = useState(false);
    const [bet, setBet] = useState(0);

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
        <Box sx={{margin: '40px auto', width: '35%', backgroundColor: '#EBE3FA',  borderRadius: '40px', padding: '50px 0'}} >
            {predictions && predictions.map((el) => {
                return (
                    <>
                        <Box key={el?.predictionId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px 20px 50px' }} >
                            <Box width='30%' sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Typography variant='h5'>{el.text}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                                    <Typography>yes</Typography>
                                    <LinearProgress variant="determinate"  value={50} sx={{ margin: '0 5px', width: '80%', borderRadius: '10px', height: '17px' }} />
                                    <Typography>no</Typography>
                                </Box>
                            </Box>
                            <Box width='30%' sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
                                <Typography variant='h4' >{new Date(Number(el.endDate) * 1000).toISOString().slice(0, 10)}</Typography>
                            </Box>
                            <Box>
                                <Input value={bet} onChange={(e) => { setBet(Number(e.target.value)); }}type='number' sx={{ backgroundColor: '#F7F2FF', borderRadius: '20px', width: '55px', padding: '0 10px', '&:before': { borderBottom: '0px!important' } }} />
                                <Button sx={{ backgroundColor: '#A095B5', color: 'black', fontWeight: 'bold', borderRadius: '20px', margin: '0 10px' }} onClick={async () => {
                                    await approveGHO({args: ['0x1B88a8fef304Ea9413D7224c4Bb878E119A5F329', bet * WEI]});
                                    await betOnPrediction({args: [el?.predictionId, bet * WEI, outcome]});
                                }}>bet on prediction</Button>
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    no <Switch checked={outcome} onClick={() => { setOutcome(!outcome); }} /> yes
                                </Box>
                            </Box>
                        </Box>
                        <Divider sx={{ height: '2px', backgroundColor: '#A095B5', width: '90%', margin: '0 auto' }} />
                    </>
                )
            })}
        </Box>
    )
}