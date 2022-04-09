import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { ethers } from "ethers"
import BigNumber from "bignumber.js";
import { Row, Col, Card, Button } from 'react-bootstrap'

const Detail = ({ marketplace, nft }) => {
    const [item, setItem] = useState({});
    const [amount, setamount] = useState(0);
    const { id} = useParams();

    const fetchNFT = async () => {
        const item = await marketplace.items(id)
        const uri = await nft.tokenURI(item.tokenId)
        const response = await fetch(uri)
        const metadata = await response.json()
        setItem(metadata)
    }

    const buyMarketItem = async (item) => {
        console.log(typeof parseInt(id))
        console.log(parseInt(id))
        console.log(typeof parseInt(amount))
        console.log(parseInt(amount))
        console.log("BigNumber: second\n\n", new BigNumber(amount))
        await (await marketplace.purchaseItem(parseInt(id), { value: new BigNumber(amount) })).wait()
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