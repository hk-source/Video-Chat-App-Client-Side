import React from "react";
import { Typography, AppBar } from "@mui/material";
import VideoPlayer from "./Components/VideoPlayer";
import Options from "./Components/Options";
import Notifications from "./Components/Notifications";
import { styled } from "@mui/material/styles";
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  borderRadius: 15,
  margin: "30px 100px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "600px",
  border: "2px solid black",

  [theme.breakpoints.down("xs")]: {
    width: "90%",
  },
}));

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
}));

const App = () => {
  return (
    <Wrapper>
      <StyledAppBar position="static" color="inherit">
        <Typography variant="h2" align="center">
          Video Chat App
        </Typography>
      </StyledAppBar>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </Wrapper>
  );
};

export default App;
