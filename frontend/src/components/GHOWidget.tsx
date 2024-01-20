
import { useContractRead, useAccount } from 'wagmi'
import ghoAbi from './abi/gho.json'
import { ethers } from 'ethers';
import { BigNumberish } from 'ethers';
import { Button } from '@mui/material';
import GHOIcon from './icons/gho.svg?react'

export default function GHOWidget() {

    const { address } = useAccount()

    const { data } = useContractRead({
        address: '0xcbE9771eD31e761b744D3cB9eF78A1f32DD99211',
        abi: ghoAbi,
        functionName: 'balanceOf',
        args: [address]
    })
    
    return(<>
        <Button variant="outlined" sx={{backgroundColor: 'none', border: 0, fontWeight: 'bold', color: '#4B4B4B', borderRadius: '10px', '&:hover': {
           background:'none',
           border: 0,
        }}} startIcon={<GHOIcon />} >
            {data ? ethers.formatEther(data as BigNumberish) : 0}
        </Button>
    </>)
}