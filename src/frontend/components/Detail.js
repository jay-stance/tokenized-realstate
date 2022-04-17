import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { ethers } from "ethers"
import BigNumber from "bignumber.js";
import { Row, Col, Card, Button } from 'react-bootstrap'

const Detail = ({ marketplace, nft }) => {
    const [item, setItem] = useState({});
    const [amount, setamount] = useState(0);
    const { id} = useParams();

    const checkLoggedIn = async () => {
        return localStorage.getItem("loggedIn") ? null: window.location.href = "/login";
    } 

    useEffect(() => {
        checkLoggedIn()
    }, [])

    const fetchNFT = async () => {
        const item = await marketplace.items(id)
        const uri = await nft.tokenURI(item.tokenId)
        const response = await fetch(uri)
        const metadata = await response.json()
        setItem(metadata)
    }

    const buyMarketItem = async (item) => {
        // const value = amount.toString()
        // value = window.web3.utils.toWei(value, 'Ether')
        // const value = (BigNumber(amount*1000000000000000000)).toString(16);
        const value = parseInt(ethers.utils.formatEther(BigNumber(amount*1000000000000000)));
        // console.log(typeof parseInt(id))
        // console.log(parseInt(id))
        console.log(typeof parseInt(value))
        console.log(parseInt(value))
        // console.log("BigNumber: second\n\n",value)
        const percent = Math.floor((amount/item.price)*100);
        console.log("percent", percent)
        await (await marketplace.purchaseItem(parseInt(id),percent, { value })).wait()
        // await (await marketplace.purchaseItem(parseInt(id), { value: parseInt(item.price) })).wait()
        window.location.href = "/";
    }
    

    useEffect(() => {
        fetchNFT()
        return localStorage.getItem("loggedIn") ? null: window.location.href = "/login";
    }, [])

    return (
        <div> 
            <Card style={{maxWidth: "500px"}}>
                <Card.Img variant="top" src={item.image} />
                    <Card.Body color="secondary">
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>
                            description: {item.description} <br/>
                            address: {item.address} <br/>
                            Interior square foot: {item.interiorSquareFoot} <br/>
                            rent per token: {item.rentPerToken} <br/>
                            Construction year: {item.constructionYear} <br/>
                            Price: {item.price} eth <br/>
                            <input placeholder="Enter desired amount in eth" value={amount} onChange={(e) => setamount(e.target.value)} type="number" />
                        </Card.Text>
                    </Card.Body>
                <Card.Footer>
                <div className='d-grid'>
                    <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {amount} ETH
                    </Button>
                </div>
                </Card.Footer>
            </Card>
        </div>
    )
}

export default Detail;