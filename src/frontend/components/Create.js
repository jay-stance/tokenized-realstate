import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState("")
  const [interiorSquareFoot, setInteriorSquareFoot] = useState("")
  const [rentPerToken, setRentPerToken] = useState("")
  const [constructionYear, setConstructionYear] = useState("")
  const [description, setDescription] = useState('')
  
  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      console.log("Always here man \n\n", image, price, name, address, interiorSquareFoot, rentPerToken, constructionYear, description, "\n\n\n")
      const result = await client.add(JSON.stringify({
        image, price, name, address, interiorSquareFoot, rentPerToken, constructionYear, description
      }))
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
    window.location.href = "/";
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setAddress(e.target.value)} value={address} size="lg" required type="text" placeholder="Address" />
              <Form.Control onChange={(e) => setInteriorSquareFoot(e.target.value)} value={interiorSquareFoot} size="lg" required type="text" placeholder="Interior square Foot" />
              <Form.Control onChange={(e) => setRentPerToken(e.target.value)} value={rentPerToken} size="lg" required type="text" placeholder="rent per Token" />
              <Form.Control onChange={(e) => setConstructionYear(e.target.value)} value={constructionYear} size="lg" required type="text" placeholder="Construction Year" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} value={description} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} value={price} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Tokenixe real Estate!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create