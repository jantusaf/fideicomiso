import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.scss";

const List = (props) => {
  
  const rows = [
    {
      rango: "0-4",
      cantidad: props.datos[0]["cantidad"],
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "John Smith",
      date: "1 March",
      amount: 785,
      method: "Cash on Delivery",
      status: "Menores",
    },
    {
      rango: "4-8",
      cantidad: props.datos[1]["cantidad"],
      img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Michael Doe",
      date: "1 March",
      amount: 900,
      method: "Online Payment",
      status: "Media",
    },
    {
      rango: "8-12",
      cantidad: props.datos[2]["cantidad"],
      img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "John Smith",
      date: "1 March",
      amount: 35,
      method: "Cash on Delivery",
      status: "Mayores",
    },

  ];

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Rango</TableCell>
            <TableCell className="tableCell">Cantidad</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.rango}>
              <TableCell className="tableCell">{row.rango}</TableCell>
             {/*  <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.img} alt="image" className="image" />
                  {row.product}
                </div>
              </TableCell> */}
              <TableCell className="tableCell">{row.cantidad}</TableCell>
            
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;