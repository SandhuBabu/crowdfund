import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// context
import { AccountContext } from '../context/AccountContext'
import { ContractWeb3Context } from '../context/ContractWeb3Context'

// components
import Requests from '../components/Request/Requests'
import Loader from '../components/Loader/Loader'
import Footer from '../components/Footer/Footer'

const RequestsPage = () => {
    const { account } = useContext(AccountContext);
    const { contract, web3 } = useContext(ContractWeb3Context);

    const navigate = useNavigate();

    const [isLoad, setIsLoad] = useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // if (account === ''){
        //     navigate("/");
        // }
        
        document.querySelector('title').innerHTML = "Etherfund - Request"
        contract && getRequests();
        setTimeout(()=>{
            setIsLoad(true)
            account && getRequests();
        }, 1000)

    }, [])

    async function getRequests() {
        try {
            let reqLists = await contract.methods.getMyRequests().call();
            console.warn(reqLists);
            setRequests(reqLists);
        } catch (err) {
            alert("Error occured while fetching data!")
            console.warn(err);
            navigate("/");
        }
    }

    
    async function voteForCampaign(campaignId) {
        try {
            await contract.methods.voteForCampaign(parseInt(campaignId))
            .send({
                from: account,
                gas: 200000
            });
            return true
        } catch (err) {
            alert("Error occured while approving. Try again!")
            console.warn(err);
            return false
        }
    }

    return (
        isLoad ?
            <>
                <Requests requests={requests} voteForCampaign={voteForCampaign} web3={web3} />
                <Footer />
            </>
            :
            <Loader />
    )
}

export default RequestsPage
