import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../../styles/Home.module.css";
import moment from "moment";

const Posts = () => {
  const router = useRouter();
  const id = router.query?.id;

  if (!id) {
    return <>Loading !!!</>;
  }

  const [postsData, setPostsData] = useState([]);
  const [userData, setUserData] = useState({});
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [pause, setPause] = useState(false);
  const fetchPostsData = async () => {
    let response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?userId=${id}`
    );
    setPostsData(response.data);
  };

  const fetchUserData = async () => {
    let response = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    setUserData(response.data);
  };

  const fetchCountriesData = async () => {
    let response = await axios.get("http://worldtimeapi.org/api/timezone");
    setCountries(response.data);
  };

  const fetchDateTime = async () => {
    let response = await axios.get(
      `https://worldtimeapi.org/api/timezone/${selectedCountry}`
    );
    setDateTime(new Date(response.data.datetime));
  };

  useEffect(() => {
    fetchPostsData();
    fetchUserData();
    fetchCountriesData();
  }, []);

  useEffect(() => {
    if(selectedCountry){
        fetchDateTime();
    }
    
  }, [selectedCountry]);

  useEffect(() => {
    let interval;
    if (!pause) {
      interval = setInterval(() => {
        setDateTime(new Date(dateTime?.getTime() + 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [dateTime, pause]);

  return (
    <div className={styles.main}>
      <div className={styles.timer}>
        <button onClick={()=>router.push('/')} className={styles.backBtn} >back</button>
        <div className={styles.timer}>
          <select onChange={(e) => setSelectedCountry(e.target.value)}>
            {countries.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
          <div className={styles.ml2} > {moment(dateTime).format("HH:mm:ss")}</div>
          <button className={styles.ml2} onClick={() => setPause(!pause)}>Pause/Start</button>
        </div>
      </div>

      <h2 className={styles.textCenter}>Profile Page</h2>
      <div className={styles.userCard}>
        <div>
          <p>{userData?.name}</p>
          <p>
            {userData?.company?.catchPhrase} | {userData?.username}
          </p>
        </div>
        <div>
          <p>
            {userData?.address?.street},{userData?.address?.suite},
            {userData?.address?.city}
          </p>
          <p>
            {userData?.email} | {userData?.phone}
          </p>
        </div>
      </div>
      <div className={styles.cardContainer}>
        {postsData?.map((item, index) => (
          <div key={index} className={styles.postCard}>
            <p className={styles.title} >{item.title}</p>
            <hr></hr>
            <p className={styles.body}>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
