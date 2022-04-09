import { useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import background from "./home.webp";
import {Link} from "react-router-dom"

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold && item.approved && !item.banned) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  useEffect(() => {
    loadMarketplaceItems()
    return localStorage.getItem("loggedIn") ? null: window.location.href = "/login";
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <div style={{ backgroundImage: `url(${background})`, width: "100%", height: "80%" }}>
          Hello World
      </div>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      <div style={{ backgroundImage: `url(${background})`,backgroundAttachment: "fixed",fontWeight: "bold", backgroundSize: "cover", width: "100%",color: "white",padding: 50, paddingTop: 150,fontFamily: "montserrat", height: 500, fontSize: 60, textAlign: "center" }}>
          Welcome to the Digitalized real Estate, Discover Houses 
      </div>
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Link to={`/detail/${item.name}/${item.itemId}`}>
                        View full Detail
                      </Link>
                      {/* <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button> */}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home