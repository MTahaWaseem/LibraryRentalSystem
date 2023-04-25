import React,{useState, useEffect} from 'react';
import '../admin_pages/HomeAdmin'
import axios from 'axios';
import { getToken } from '../Utils/Common';


const HomeManager = () => {
  const [Reviews, setReviews] = useState(JSON.parse(sessionStorage.getItem('Reviews')));
  const [Queries, setQueries] = useState(JSON.parse(sessionStorage.getItem('Queries')));
  const [Orders, setOrders] = useState(JSON.parse(sessionStorage.getItem('Orders')));
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const [Books, setBooks] = useState(JSON.parse(sessionStorage.getItem('Books')));
  const [Categories, setCategories] = useState(JSON.parse(sessionStorage.getItem('Categories')));


  useEffect(() => {
    const fetchlname = async () => {
        setLoading(true);
        let config = {
            headers: {
                Authorization: "basic " + token
            }
        }
        await axios.get('http://localhost:4000/users/getLibrary', config, {
        }).then(async response => {
            sessionStorage.setItem('Library', JSON.stringify(response.data.data.message.library[0].Name));

            setLoading(false);
            //window.location.assign('/manager/Books');
            
        }).catch(error => {
      
        });
      
      };
          
      
    fetchlname();
    
}, []);
  const fetchOrders = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users/getOrdersLibrary', config, {
    }).then(async response => {
        setOrders(response.data.data.message.info);
        console.table(response.data.data.message.info)
        sessionStorage.setItem('Orders', JSON.stringify(response.data.data.message.info));
        //console.log(libraries);
        setLoading(false);
        window.location.assign('/manager/Orders')
        
    }).catch(error => {

    });


};

const fetchCategories = async () => {
  setLoading(true);
  let config = {
      headers: {
          Authorization: "basic " + token
      }
  }
  await axios.get('http://localhost:4000/users/getCategory', config, {
  }).then(async response => {
      setCategories(response.data.data.message.Categories);
      console.log(Categories);
      sessionStorage.setItem('Categories', JSON.stringify(response.data.data.message.Categories));
     
      setLoading(false);
      window.location.assign('/manager/Categories');

  }).catch(error => {

  });

}
  const fetchBooks = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users/getBooksLibrary', config, {
    }).then(async response => {
        setBooks(response.data.data.result.data);
        sessionStorage.setItem('Books', JSON.stringify(response.data.data.result.data));
        setLoading(false);
        window.location.assign('/manager/Books');
        
    }).catch(error => {
  
    });
    
    
      setLoading(true);
      let config2 = {
          headers: {
              Authorization: "basic " + token
          }
      }
      await axios.get('http://localhost:4000/users/getCategory', config2, {
      }).then(async response => {
          // console.table(response.data.data.message.Categories)
          sessionStorage.setItem('Categories', JSON.stringify(response.data.data.message.Categories));
          setLoading(false);
          //window.location.assign('/manager/Books');
          
      }).catch(error => {
    
      });
    
    
  };

  const fetchReviews = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    console.log("Inside Reviews 1")
    await axios.get('http://localhost:4000/users/seeReviewsLibrary', config, {
    }).then(async response => {
        setReviews(response.data.data.message.Reviews);
        sessionStorage.setItem('Reviews', JSON.stringify(response.data.data.message.Reviews));
        setLoading(false);
        
    console.log("Inside Reviews 2")
        window.location.assign('/manager/Reviews');
        
    }).catch(error => {
    });
  
  };

  const fetchqueries = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users/getQueries', config, {
    }).then(async response => {
        setQueries(response.data.data.message.Queries);
        sessionStorage.setItem('Queries', JSON.stringify(response.data.data.message.Queries));
        setLoading(false);
        window.location.assign('/manager/Queries');
        
    }).catch(error => {
  
    });
  
  };
  return (
    <div className='HomeManager'>
      
        
        {/* <div class="container-homemanager"><img class="cover" src="./img/undraw.png" /></div> */}
        <div className="zone blue grid-wrapper">
        
        
          <div className="boxorder zone"><a onClick={fetchOrders} className="picture1">
          <img src="https://cdn-icons-png.flaticon.com/512/1524/1524539.png"></img>
          <h2>Orders</h2></a>
          </div> 

          <div className="boxbook zone"><a onClick={fetchBooks} className="picture2">
          <img src="https://cdn1.iconfinder.com/data/icons/education-outlines/100/15-256.png"></img>
          <h2>Books</h2></a>
          </div>
          
          
          <div className="boxcategories zone"><a  onClick={fetchCategories} className="picture3">
          <img src="https://cdn-icons-png.flaticon.com/512/94/94715.png"></img>
          <h2>Categories</h2></a>
          </div>
         
          <br></br>
          <div className="boxquery zone"><a onClick={fetchqueries} className="picture4">
          <img src="https://cdn-icons-png.flaticon.com/512/4611/4611426.png"></img>
          <h2>Queries</h2></a>
          </div>

          <div className="boxreview zone"><a onClick={fetchReviews} className="picture5">
          <img src="https://cdn-icons-png.flaticon.com/512/651/651191.png"></img>
          <h2>Reviews</h2></a>
          </div>
          
          
        </div>
        
        
    </div>


  )
}

export default HomeManager;