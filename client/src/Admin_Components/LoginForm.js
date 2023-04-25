// import React,{useState} from "react";
// import './LoginForm.css'


// export default class LoginForm extends React.Component{
    
//     constructor(props) {
//         super(props);
       
//         this.state = {
//           error: null,
//           loading: false,
//           email,
//           password
//         };
//       }

      
    
//     render(){
         
        

// //     const handleLogin = async () => {
// //         setError(null);
// //         setLoading(true);
// //         axios.post("http://localhost:4000/users/login", {
// //             email: email,
// //             password: password
// //         }).then(async response => {
// //             setLoading(false);
// //             setError(null);
// //             setLoading(true);
// //             const token = response.data.data.message.token;
// //             setUserSession(token);
// //             let config = {
// //                 headers: {
// //                     Authorization: "basic " + token
// //                 }
// //             }

// //             await axios.get("http://localhost:4000/users/user-profile", config, {
// //             }).then(response => {
// //                 setLoading(false);
// //                 // console.log(response.data.data.result.profile[0]);
// //                 setUserIDSession(response.data.data.result.profile[0]);

// //             }).catch(error => {
// //                 setLoading(false);
// //                 console.log("errors >>> ", error)
// //             }// console.log('error >>>', error);
// //             )
// //             if (response.data.data.message.Type == 2)
// //             window.location.assign('/dashboard');
// //             else {
// //                 console.log("This isnt customer");
// //                 removeUserIDSession();
// //                 removeUserSession();
// //             }
// //         }).catch(error => {
// //             setLoading(false);
// //             if (error.response.status === 500 || error.response.status === 400 ) {
// //                 setError(error.response.data.data.message)
// //             }
// //         }
// //         )

// //     }
// const FormHeader = props => (
//     <h2 id="headerTitle">{props.title}</h2>
// );


// const Form = props => (
//   <div>
//     <FormInput description="Email" placeholder="Enter your email" type="text" value ={props.email}/>
//     <FormInput description="Password" placeholder="Enter your password" type="password" value ={props.password}/>
//     <FormButton title="Log in"/>
//   </div>
// );
// const FormInput = props => (
//     <div className="row">
//       <label>{props.description}</label>
//       <input type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.setEmail}/>
//     </div>  
//   );
//   const FormButton = props => (
//     <div id="button" className="row">
//       <button>{props.title}</button>
//     </div>
//   );
//   const OtherMethods = props => (
//     <div id="alternativeLogin" className="container">
//       <label><a href="/register">Not a user yet?</a></label>    
//       </div>
    
//   );
  

//       return(
//         <div id="loginform">
//           <FormHeader title="Login" />
//           <Form email={this.state.email} password={this.state.password} setEmail = {e => this.setState({email: e.target.value})} />
//           <OtherMethods />
//         </div>
//       )
//     }
//    }

   
  
// //   const FormHeader = props => (
// //       <h2 id="headerTitle">{props.title}</h2>
// //   );
  
  
// //   const Form = props => (
// //     <div>
// //       <FormInput description="Email" placeholder="Enter your email" type="text" value ={props.email}/>
// //       <FormInput description="Password" placeholder="Enter your password" type="password"/>
// //       <FormButton title="Log in"/>
// //     </div>
// //  );
// //  const FormInput = props => (
// //     <div class="row">
// //       <label>{props.description}</label>
// //       <input type={props.type} placeholder={props.placeholder} value={props.value} onChange={e => this.setState({value: e.target.value})}/>
// //     </div>  
// //   );
  
// //   const FormButton = props => (
// //     <div id="button" class="row">
// //       <button>{props.title}</button>
// //     </div>
// //   );
  
// //   const FormInput = props => (
// //     <div class="row">
// //       <label>{props.description}</label>
// //       <input type={props.type} placeholder={props.placeholder} value={props.value} onChange={e => this.setState({value: e.target.value})}/>
// //     </div>  
// //   );
  
// //   const OtherMethods = props => (
// //     <div id="alternativeLogin" className="container">
// //       <label><a href="/register">Not a user yet?</a></label>    
// //       </div>
    
// //   );
  
