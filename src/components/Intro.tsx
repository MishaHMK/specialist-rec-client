import React, {useEffect, useState} from 'react';
import { Button, Carousel} from 'antd';
import { ReconciliationFilled, CalendarFilled, MessageFilled} from '@ant-design/icons';
import AuthorizeApi from "../api/authorizeApi";
import { useNavigate } from "react-router-dom";
import AuthLocalStorage from "../AuthLocalStorage";
import jwt, { jwtDecode } from "jwt-decode";

export const Intro: React.FC = () => {
    const signedIn = AuthorizeApi.isSignedIn();
    const [id, setId] = useState<string>("");
    const navigate = useNavigate();
  
    useEffect(() => {
      if (signedIn) {
        const token = AuthLocalStorage.getToken() as string;
        const user: any = jwtDecode(token);
        setId(user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      }
    }, [signedIn]);
  
    const toLogin = () => navigate("../login", { replace: true });
    const toCalendar = () => signedIn && navigate("../calendar", { replace: true });
    const toRecommendation = () => signedIn && navigate(`../recommendation/${id}`, { replace: true });
    const register = () => navigate("../register", { replace: true });
  
    const contentStyle: React.CSSProperties = {
      borderRadius: '25px',
      height: '500px',
      width: '800px',
      color: 'white',
      backgroundColor: '#051643'
    };
  
    return (
      <div style={{ paddingLeft: '25%', paddingTop: '0%', paddingBottom: '0%' }}>
        <div style={contentStyle}>
          <Carousel autoplay autoplaySpeed={5000} dots={true} dotPosition="top" style={{ paddingBottom: '8%' }}>
            <div>
              <h1 style={{ paddingTop: '3%', color: "white" }}>Search Title</h1>
              <ReconciliationFilled style={{ paddingTop: '5%', color: "white", fontSize: "120px" }} />
              <h3 style={{ paddingTop: '5%', color: "white" }}>Search Line <br /> Search Line2</h3>
              <div style={{ paddingTop: '5%' }}>
                <Button type="primary" shape="round">Search</Button>
              </div>
            </div>
            <div>
              <h1 style={{ paddingTop: '3%', color: "white" }}>Title</h1>
              <CalendarFilled style={{ paddingTop: '5%', color: "white", fontSize: "120px" }} />
              <h3 style={{ paddingTop: '5%', color: "white" }}>Text <br /> Text2</h3>
              <div style={{ paddingTop: '5%' }}>
                <Button onClick={toCalendar} type="primary" shape="round">Meetings</Button>
              </div>
            </div>
            <div>
              <h1 style={{ paddingTop: '3%', color: "white" }}>Text</h1>
              <MessageFilled style={{ paddingTop: '5%', color: "white", fontSize: "120px" }} />
              <h3 style={{ paddingTop: '5%', color: "white" }}>Text <br /></h3>
              <div style={{ paddingTop: '5%' }}>
                <Button onClick={toRecommendation} type="primary" shape="round">Recommendation</Button>
              </div>
            </div>
          </Carousel>
        </div>
  
        {!signedIn && (
          <div style={{ paddingRight: '18%', marginTop: '25px' }}>
            <Button type="primary" shape="round" onClick={toLogin} style={{ marginRight: '10px' }}>Log In</Button>
            <Button shape="round" onClick={register}>Register</Button>
          </div>
        )}
      </div>
    );
  };
  
  export default Intro;