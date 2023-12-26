import { IconButton, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export const SearchBar = ({ searchQuery, setSearchQuery }: any) => (
  <form>
    <TextField
      id="search-bar"
      className="text-[0.75rem]"
      style={{
        color: "#fff",
        borderRadius: "8px",
        background: "rgba(15, 14, 71, 0.3)",
        boxShadow: "rgba(255, 255, 255, 0.2) 0px 0px 0px 0",
        outline: "none",
        border: "none"
      }}
      onInput={(e: any) => {
        setSearchQuery(e.target.value);
      }}
      value={searchQuery}
      sx={{ input: { color: '#fff' } }}
      // label="Enter a movie name"
      variant="outlined"
      placeholder="Enter the movie name..."
      size="small"
    />
    <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "white" }} />
    </IconButton>
  </form>
);