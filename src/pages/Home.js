import React,{useEffect,useState} from "react";
import Header from "../components/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { randevularState, hastalarState } = useSelector((state) => state);
  
  /* 
    Randevu listeleme kuralları
    1. Yeni tarihten eskiye doğru azalarak gitmeli 
    2. Bugünden eski randevular gösterilmemeli
    3. Bir randevuya 5 dk kala backgraound'u sarıya dönsün
  */
 const [checkDate,setCheckDate]=useState(new Date())
 useEffect(()=>{
  const interval=setInterval(() => {
    setCheckDate(new Date())
    console.log("...")
  }, 1000);
  return ()=>{
    clearInterval(interval)
  }
 },[])

  var sortedRandevular=randevularState.randevular.sort(function(item1,item2){
    return new Date(item2.date) - new Date(item1.date);
  });
  const today=new Date()
  console.log("today",today.getFullYear(),today.getMonth(),today.getDate())
  sortedRandevular = sortedRandevular.filter((item)=>{
    const date=new Date(item.date)
    console.log(date.getFullYear(),date.getMonth(),date.getDate())
    if(date.getFullYear()<today.getFullYear()){
      return false
    }
    if(date.getFullYear() === today.getFullYear() && date.getMonth() < today.getMonth()){
      return false
    }
    if(date.getMonth() === today.getMonth() && date.getDate() < today.getDate() ){
      return false
    }
    return true
  })


  const navigate = useNavigate();
  if (
    hastalarState.start === true ||
    hastalarState.fail === true ||
    randevularState.start === true ||
    randevularState.fail === true
  ) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <Header />
      <TableContainer style={{ marginTop: "50px" }} component={Paper}>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}>
          <Button onClick={() => navigate("/randevu-ekle")} variant="contained">
            Randevu Ekle
          </Button>
        </div>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#999" }}>
            <TableRow>
              <TableCell>Tarih</TableCell>
              <TableCell>Adı</TableCell>
              <TableCell>Soyadı</TableCell>
              <TableCell>Telefon Numarası</TableCell>
              <TableCell>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {randevularState.randevular.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  Kayıtlı Hasta Bulunmamaktadır
                </TableCell>
              </TableRow>
            )}
            {sortedRandevular.map((randevu) => {
              const aradigimHasta = hastalarState.hastalar.find(
                (hasta) => hasta.id === randevu.hastaId
              );
              const date=new Date(randevu.date)
              var isNear=false
              if( date.getTime() - checkDate.getTime() <= 300000 ){
                isNear = true
              }
              if(checkDate.getTime() - date.getTime() > 60000) isNear = false
              return (
                <TableRow
                  style={{
                    backgroundColor: isNear ? 'yellow':'white'
                  }}
                  key={randevu.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}>
                  <TableCell component="th" scope="row">
                    {new Date(randevu.date).toLocaleString()}
                  </TableCell>
                  <TableCell>{aradigimHasta.name}</TableCell>
                  <TableCell>{aradigimHasta.surname}</TableCell>
                  <TableCell>{aradigimHasta.phone}</TableCell>
                  <TableCell>butonlar gelecek</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;
