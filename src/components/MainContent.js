import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import moment from "moment";
import Prayer from "./Prayer";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import ImageCard from "./ImageCard";

const MainContent = () => {
  const currentDate = new Date();
  const currentDay = currentDate.toISOString().split("T")[0];
  const [today, setToday] = useState("");
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [temp, setTemp] = useState("");
  const [timings, setTimings] = useState({
    fajr: "",
    dhuhr: "",
    asr: "",
    maghrib: "",
    isha: "",
  });

  const prayerArray = [
    { key: "fajr", name: "Fajr", time: timings.fajr },
    { key: "dhuhr", name: "Dhuhr", time: timings.dhuhr },
    { key: "asr", name: "Asr", time: timings.asr },
    { key: "maghrib", name: "Maghrib", time: timings.maghrib },
    { key: "isha", name: "Isha", time: timings.isha },
  ];
  const getData = async () => {
    const res = await axios(
      `https://api.aladhan.com/v1/timingsByAddress/${currentDay}?address=Ratlam`
    );

    const times = {
      fajr: res.data.data.timings.Fajr,
      dhuhr: res.data.data.timings.Dhuhr,
      asr: res.data.data.timings.Asr,
      maghrib: res.data.data.timings.Maghrib,
      isha: res.data.data.timings.Isha,
    };

    setData(res.data.data);
    setTimings(times);
  };

  useEffect(() => {
    getData();
    const date = moment();
    setToday(date.format("Do MMM YYYY | h:mm A"));

  }, []);

  const get = async () => {
    const res = await axios(
      `https://api.aladhan.com/v1/timingsByAddress/${currentDay}?address=${search}`
    );

    const times = {
      fajr: res?.data.data.timings?.Fajr,
      dhuhr: res?.data.data.timings?.Dhuhr,
      asr: res?.data.data.timings?.Asr,
      maghrib: res?.data.data.timings?.Maghrib,
      isha: res?.data.data.timings?.Isha,
    };

    setTimings(times);
    setData(res.data.data);
    setTemp(search);
  };

  const searchHandler=(e)=> {
    e.preventDefault();
    setData(null);

    if (search !== "") {
      get();

      setSearch("");
    } else {
      alert("Enter the city name");

      getData();
    }
    setSearch("");
  }

  useEffect(() => {
    const t = setInterval(() => {
      setUpCountdownTimer();
    }, 1000);
    return () => {
      clearInterval(t);
    };
  }, [timings]);

  
  const setUpCountdownTimer = () => {
    const momentNow = moment();
    let nextPrayer = 0;

    if (
      momentNow.isAfter(moment(timings.fajr, "hh:mm ")) &&
      momentNow.isBefore(moment(timings.dhuhr, "hh:mm"))
    ) {
      nextPrayer = 1;
    } else if (
      momentNow.isAfter(moment(timings.dhuhr, "hh:mm")) &&
      momentNow.isBefore(moment(timings.asr, "hh:mm"))
    ) {
      nextPrayer = 2;
    } else if (
      momentNow.isAfter(moment(timings.asr, "hh:mm")) &&
      momentNow.isBefore(moment(timings.maghrib, "hh:mm"))
    ) {
      nextPrayer = 3;
    } else if (
      momentNow.isAfter(moment(timings.maghrib, "hh:mm")) &&
      momentNow.isBefore(moment(timings.isha, "hh:mm"))
    ) {
      nextPrayer = 4;
    } else {
      nextPrayer = 0;
    }

    
    

    setNextPrayerIndex(nextPrayer);

    const nextPrayerObj = prayerArray[nextPrayer];
    const nextPrayerTime = nextPrayerObj.time;
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
    const durationRemainingTime = moment.duration(remainingTime);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajerToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDiff = midnightDiff + fajerToMidnightDiff;

      remainingTime = totalDiff;
    }

    setRemainingTime(
      `${durationRemainingTime.hours()}:${durationRemainingTime.minutes()}:${durationRemainingTime.seconds()}`
    );
  };

  return (
    <>
      {/* TOP ROW */}
      <div className="top">
        <Grid container>
          <Grid xs={6}>
            <div>
            <h1>{temp !== "" ? temp : "Ratlam"}</h1>

              <p style={{ color: "var(--gray)" }}>{today}</p>
            </div>
          </Grid>

          <div className="search">
            <Grid xs={6} style={{ padding: "20px 0" }}>
              <Box sx={{ minWidth: 120 }}>
                <form className="form" onSubmit={searchHandler}>
                <button className="btn">Search</button>
                <input
                 type="text"
                   onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type Your City"
                    value={search}
                      dir="ltr"
                     />        

                  
                </form>
              </Box>
            </Grid>
          </div>
        </Grid>
      </div>
      {/* TOP ROW */}

      <Divider style={{ background: `var(--gray)` }} />

      {/* Preyer Cards */}
      {data ? (
        <div className="content" style={{ padding: "10px 0" }}>
          <Grid container spacing={2}>
            {/* image */}
            <Grid xs={6} style={{ padding: "20px" }}>
              <ImageCard
                time={remainingTime}
                name={prayerArray[nextPrayerIndex].name}
              />
            </Grid>
            {/* image */}

            {/* Times */}
        <Grid xs={6} style={{ padding: "20px" }}>
       <Stack>
         <Prayer name="Fajr" time={timings.fajr} />
          <Prayer name="Johar" time={timings.dhuhr} />
          <Prayer name="Asr" time={timings.asr} />
       <Prayer name="Maghrib" time={timings.maghrib} />
        <Prayer name="Isha" time={timings.isha} />
        </Stack>
         </Grid>
            {/* Times */}
          </Grid>
        </div>
      ) : (
        <h3 className="loading"></h3>
      )}
      {/* Preyer Cards */}
    </>
  );
};

export default MainContent;
