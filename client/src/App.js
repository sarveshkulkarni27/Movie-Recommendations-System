import React, {useState, useEffect} from 'react'
import { Form , Input, Typography, Button, Row } from "antd"
import { Movies } from './components/Movies';

function App() {
  const [data, setData] = useState([{}])
  const [movieDescription, setMovieDescription] = useState("");
  const { Text } = Typography;
  const { TextArea } = Input;
  const [commonMovies, setCommonMovies] = useState([]);
  const [allGenreMovieDict, setAllGenreMovieDict] = useState([]);
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
    if(result && 'allGenreMovieDict' in result){
      setAllGenreMovieDict(result['allGenreMovieDict'])
    }
    // console.log("predictedGenres: ", result['predictedGenres'])
    // console.log("moviesPerGenre: ", result['moviesPerGenre'])
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
      if(result['predictedGenres'].indexOf('sci-fi') !== -1 && isMoviesPerGenre){
        let scifi = 'sci-fi'
        setScifiMovies(result['moviesPerGenre']['sci-fi'])
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
      <b>Movie Recommendations System</b>
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

          {displayMovies && commonMovies && commonMovies.length > 0 &&
            <div>Movies across all predicted genres</div>          
          }          
          {displayMovies && commonMovies && commonMovies.length > 0 &&
            <Movies commonMovies = { commonMovies } allGenreMovieDict = {allGenreMovieDict} />          
          }
          {displayMovies && genres && genres.length == 0 &&
           <div>Sorry, we were not able to predict the genres for the input movie description. Please try again.</div>
          }
          {displayMovies && actionMovies && actionMovies.length > 0 &&
            <div>Action Movies</div>          
          } 
          {displayMovies && actionMovies && actionMovies.length > 0 &&
            <Movies commonMovies = { actionMovies } allGenreMovieDict = {allGenreMovieDict} />          
          }
          {displayMovies && romanticMovies && romanticMovies.length > 0 &&
            <div>Romantic Movies</div>          
          } 
          {displayMovies && romanticMovies && romanticMovies.length > 0 &&
            <Movies commonMovies = { romanticMovies } allGenreMovieDict = {allGenreMovieDict} />          
          }
          {displayMovies && comedyMovies && comedyMovies.length > 0 &&
            <div>Comedy Movies</div>          
          } 
          {displayMovies && comedyMovies && comedyMovies.length > 0 &&
            <Movies commonMovies = { comedyMovies } allGenreMovieDict = {allGenreMovieDict} />          
          }
          {displayMovies && horrorMovies && horrorMovies.length > 0 &&
            <div>Horror Movies</div>          
          } 
          {displayMovies && horrorMovies && horrorMovies.length > 0 &&
            <Movies commonMovies = { horrorMovies } allGenreMovieDict = {allGenreMovieDict} />          
          }
          {displayMovies && historicalMovies && historicalMovies.length > 0 &&
            <div>Historical Movies</div>          
          } 
          {displayMovies && historicalMovies && historicalMovies.length > 0 &&
            <Movies commonMovies = { historicalMovies } allGenreMovieDict = {allGenreMovieDict} />          
          }
          {displayMovies && fantasyMovies && fantasyMovies.length > 0 &&
            <div>Fantasy Movies</div>          
          } 
          {displayMovies && fantasyMovies && fantasyMovies.length > 0 &&
            <Movies commonMovies = { fantasyMovies } allGenreMovieDict = {allGenreMovieDict} />          
          }
          {displayMovies && scifiMovies && scifiMovies.length > 0 &&
            <div>Sci-Fi Movies</div>          
          } 
          {displayMovies && scifiMovies && scifiMovies.length > 0 &&
            <Movies commonMovies = { scifiMovies } allGenreMovieDict = {allGenreMovieDict} />          
          }                                                                           
        </Row>
    </div>
    </div>
  )
}

export default App