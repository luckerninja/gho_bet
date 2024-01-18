
import { useContractRead } from 'wagmi'
import ghoAbi from './abi/gho.json'
import { ethers } from 'ethers';
import { BigNumberish } from 'ethers';
import { Button } from '@mui/material';
import GHOIcon from './icons/gho.svg?react'
import { watchPendingTransactions } from 'wagmi/actions';

export default function GHOWidget() {

    const { data, isError, isLoading } = useContractRead({
        address: '0xcbE9771eD31e761b744D3cB9eF78A1f32DD99211',
        abi: ghoAbi,
        functionName: 'balanceOf',
        args: ['0xDD6BFbe9EC414FFABBcc80BB88378c0684e2Ad9c']
    })
    
    return(<>
        <Button variant="outlined" sx={{backgroundColor: 'white', border: 0, color: 'black', borderRadius: '10px', '&:hover': {
           background:'white',
           border: 0,
        }}} startIcon={<GHOIcon />} >
            {ethers.formatEther(data as BigNumberish)}
        </Button>
    </>)
}