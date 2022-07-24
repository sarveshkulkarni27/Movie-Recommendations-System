import React, {useState, useEffect} from 'react'
import { Form , Input, Typography, Button, Row } from "antd"
import { Movies } from './components/Movies';

function App() {
  const [data, setData] = useState([{}])
  const [movieDescription, setMovieDescription] = useState("");
  const { Text } = Typography;
  const { TextArea } = Input;
  const [commonMovies, setCommonMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [displayMovies, setDisplayMovies] = useState(false);
  const [displayButton, setDisplayButton] = useState(true);


  // const [actionGenre, setActionGenre] = useState(false);
  // const [romanticGenre, setRomanticGenre] = useState(false);
  // const [comedyGenre, setComedyGenre] = useState(false);
  // const [horrorGenre, setHorrorGenre] = useState(false);
  // const [historicalGenre, setHistoricalGenre] = useState(false);
  // const [fantasyGenre, setFantasyGenre] = useState(false);
  // const [scifiGenre, setScifiGenre] = useState(false);


  const [actionMovies, setActionMovies] = useState([]);
  const [romanticMovies, setRomanticMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [historicalMovies, setHistoricalMovies] = useState([]);
  const [fantasyMovies, setFantasyMovies] = useState([]);
  const [scifiMovies, setScifiMovies] = useState([]);


  const toggleDisplay = () => {
    console.log("In toggle")
    setDisplayButton(false)
    setDisplayMovies(true)
  }

  useEffect(() => {
    fetch("/movie").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  if(commonMovies && commonMovies.length > 0){
    console.log("Movies", commonMovies)
  }

  const update_common_data = async (result) => {
    if(result && 'commonMovies' in result){
      setCommonMovies(result['commonMovies'])
    }
    const isMoviesPerGenre = (result && 'moviesPerGenre' in result) ? true : false;
    if(result && 'predictedGenres' in result){
      setGenres(result['predictedGenres'])
      if(result['predictedGenres'].indexOf('action') !== -1 && isMoviesPerGenre){
        setActionMovies(result['moviesPerGenre'].action)
      }
      if(result['predictedGenres'].indexOf('romantic') !== -1 && isMoviesPerGenre){
        setRomanticMovies(result['moviesPerGenre'].romantic)
      }
      if(result['predictedGenres'].indexOf('comedy') !== -1 && isMoviesPerGenre){
        setComedyMovies(result['moviesPerGenre'].comedy)
      }
      if(result['predictedGenres'].indexOf('horror') !== -1 && isMoviesPerGenre){
        setHorrorMovies(result['moviesPerGenre'].horror)
      }
      if(result['predictedGenres'].indexOf('historical') !== -1 && isMoviesPerGenre){
        setHistoricalMovies(result['moviesPerGenre'].historical)
      }
      if(result['predictedGenres'].indexOf('fantasy') !== -1 && isMoviesPerGenre){
        setFantasyMovies(result['moviesPerGenre'].fantasy)
      }
      if(result['predictedGenres'].indexOf('sci-fi"') !== -1 && isMoviesPerGenre){
        let scifi = 'sci-fi'
        setScifiMovies(result['moviesPerGenre'].scifi)
      }      
    }

  }

  return (
    <div
      style={{
        fontSize: 25,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <div
      style={{
        width: "100%",
        padding: "24px 24px"
      }}
    >
      <b>Movie Recommendation System</b>
      <Row gutter={[24, 24]}>
        <Form
          // labelCol={{
          //   span: 4,
          // }}
          // wrapperCol={{
          //   span: 14,
          // }}
          // layout="horizontal"
          style={{
            fontSize: 20,
            textAlign: "center"
          }}             
        >
          <Form.Item
            name="movieDescription"
            autoComplete="off"
            label={<Text>Movie Description</Text>}
          >
            <Input
              size="large"
              placeholder = "Movie Description"
              value = "movieDescription"
              onChange={e => setMovieDescription(e.target.value)}
            />
          </Form.Item>
          {/* <Form.Item 
            name="movieDescription"
            autoComplete="off"
            label={<Text>Please enter the Movie Description below: </Text>}        
          >
            <TextArea rows={10} />
          </Form.Item>         */}

        <Form.Item>
          {displayButton && <Button onClick={async () => {
            const movieDescrptionText = { movieDescription }
            const response = await fetch('/input_text', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(movieDescrptionText)
            })
            .then(response => response.json())
            .then(result => {
              update_common_data(result)
              // update_common_data(result['commonMovies'], result['predictedGenres'])
             }).then(toggleDisplay)
          }}>Submit</Button>
          }
        </Form.Item>  
        </Form>
        </Row>
        <Row>
          {displayMovies && genres.length > 0 && 
          //  <div>Predicted Genres: {genres.map((genre) => <li>{genre}</li>)}</div>
          //  <div>Predicted Genres: {genres}</div>\
          <div>Predicted Genres: {genres.join(", ")}</div>
          }       
        </Row>
        <Row gutter={[24, 24]}
              style={{
                fontSize: 25,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "column"
              }}
        >

          {displayMovies && commonMovies.length > 0 &&
            <div>Common Movies  </div>          
          }          
          {displayMovies && commonMovies.length > 0 &&
            <Movies commonMovies = { commonMovies }/>          
          }
          {displayMovies && genres && genres.length == 0 &&
           <div>Please enter valid movie description</div>
          }
          {displayMovies && actionMovies.length > 0 &&
            <div>Action Movies  </div>          
          } 
          {displayMovies && actionMovies.length > 0 &&
            <Movies commonMovies = { actionMovies }/>          
          }
          {displayMovies && romanticMovies.length > 0 &&
            <div>Romantic Movies  </div>          
          } 
          {displayMovies && romanticMovies.length > 0 &&
            <Movies commonMovies = { romanticMovies }/>          
          }
          {displayMovies && comedyMovies.length > 0 &&
            <div>Comedy Movies  </div>          
          } 
          {displayMovies && comedyMovies.length > 0 &&
            <Movies commonMovies = { comedyMovies }/>          
          }
          {displayMovies && horrorMovies.length > 0 &&
            <div>Horror Movies  </div>          
          } 
          {displayMovies && horrorMovies.length > 0 &&
            <Movies commonMovies = { horrorMovies }/>          
          }
          {displayMovies && historicalMovies.length > 0 &&
            <div>Historical Movies  </div>          
          } 
          {displayMovies && historicalMovies.length > 0 &&
            <Movies commonMovies = { historicalMovies }/>          
          }
          {displayMovies && fantasyMovies.length > 0 &&
            <div>Fantasy Movies  </div>          
          } 
          {displayMovies && fantasyMovies.length > 0 &&
            <Movies commonMovies = { fantasyMovies }/>          
          }
          {displayMovies && scifiMovies.length > 0 &&
            <div>Sci-Fi Movies  </div>          
          } 
          {displayMovies && scifiMovies.length > 0 &&
            <Movies commonMovies = { scifiMovies }/>          
          }                                                                           
        </Row>
    </div>
    </div>
  )
}

export default App