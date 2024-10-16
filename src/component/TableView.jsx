import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import moment from "moment";
import {
  Slider,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Switch,
  TextField,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import CloseIcon from "@mui/icons-material/Close";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { data as sampleData } from "../sample-data";

function TableView() {
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [salePriceRange, setSalePriceRange] = useState([0, 200]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryFilter, setSubcategoryFilter] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [nameFilter, setNameFilter] = useState(""); 
  const [filteredData, setFilteredData] = useState(sampleData);
  const [groupByColumns, setGroupByColumns] = useState([]);
  const [sorting, setSorting] = useState([{ id: "id", desc: false }]);
  const [drawerContainer, setDrawerContainer] = useState({isDrawerOpen: false,filterType: ""});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [maxPrice, setMaxPrice] = useState({ price: 0, sale_price: 0 });
  const [createdAtRange, setCreatedAtRange] = useState([null, null]); 
  const [updatedAtRange, setUpdatedAtRange] = useState([null, null]);
  
  useEffect(() => {
    const highestPrice = Math.max(...sampleData.map((item) => item.price || 0));
    setMaxPrice((prev) => ({ ...prev, price: highestPrice }));
    setPriceRange([0, highestPrice]);
    const highestSalePrice = Math.max(
      ...sampleData.map((item) => item.sale_price || 0)
    );
    setMaxPrice((prev) => ({ ...prev, sale_price: highestSalePrice }));
    console.log(highestSalePrice);
    setSalePriceRange([0, highestSalePrice]);

    const categories = [...new Set(sampleData.map(item => item.category))];
    const subCategories = [...new Set(sampleData.map(item => item.subcategory))];
    setCategoryList(categories)
    setSubcategoryList(subCategories)
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let updatedData = sampleData;

      if (nameFilter) {
        updatedData = updatedData.filter((row) =>
          row.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (categoryFilter.length > 0) {
        updatedData = updatedData.filter((row) =>
          categoryFilter.includes(row.category)
        );
      }

      if (subcategoryFilter.length > 0) {
        updatedData = updatedData.filter((row) =>
          subcategoryFilter.includes(row.subcategory)
        );
      }

      updatedData = updatedData.filter(
        (row) => row.price >= priceRange[0] && row.price <= priceRange[1]
      );

      updatedData = updatedData.filter(
        (row) =>
          row.sale_price >= salePriceRange[0] &&
          row.sale_price <= salePriceRange[1]
      );

      if (createdAtRange[0] && createdAtRange[1]) {
        const startDate = new Date(createdAtRange[0]).getTime();
        const endDate = new Date(createdAtRange[1]).getTime();
        updatedData = updatedData.filter((item) => {
          const createdAt = new Date(item.createdAt).getTime();
          return createdAt >= startDate && createdAt <= endDate;
        });
      }

      if (updatedAtRange[0] && updatedAtRange[1]) {
        const startDate = new Date(updatedAtRange[0]).getTime();
        const endDate = new Date(updatedAtRange[1]).getTime();
        updatedData = updatedData.filter((item) => {
          const updatedAt = new Date(item.updatedAt).getTime();
          return updatedAt >= startDate && updatedAt <= endDate;
        });
      }

      setFilteredData(updatedData);
    };

    applyFilters();
  }, [
    categoryFilter,
    subcategoryFilter,
    priceRange,
    createdAtRange,
    updatedAtRange,
    salePriceRange,
    nameFilter,
  ]);

  const handleGroupBy = (columnIds) => {
    const newGroupings = columnIds.filter(
      (columnId) => !groupByColumns.includes(columnId)
    );
    const remainingGroupings = groupByColumns.filter((col) =>
      columnIds.includes(col)
    );

    setGroupByColumns([...remainingGroupings, ...newGroupings]);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        size: 50,
        enableColumnFilter: false,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
        filterFn: "fuzzy",
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 150,
        enableGrouping: true,
        filterVariant: "multi-select",
        filterSelectOptions: categoryList,
      },
      {
        accessorKey: "subcategory",
        header: "Subcategory",
        size: 150,
        enableGrouping: true,
        filterVariant: "select",
        filterSelectOptions: subcategoryList,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 150,
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MMM-YYYY HH:mm"),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 150,
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MMM-YYYY HH:mm"),
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 150,
        filterVariant: "range",
        filterFn: "between",
      },
      {
        accessorKey: "sale_price",
        header: "Sale Price",
        size: 150,
        filterVariant: "range",
        filterFn: "between",
      },
    ],
    [categoryList, subcategoryList]
  );

  const DrawerTitle = (drawerType) => {
    switch (drawerType) {
      case "sort":
        return "Sorting Options";
      case "group":
        return "Create Groups";
      case "visibility":
        return "Show/Hide Columns";
      case "filter":
        return "Filters";
      default:
        return "Filters and Options";
    }
  };

  const handleSorting = (columnId) => {
    const currentSort = sorting.find((sort) => sort.id === columnId);
    if (currentSort) {
      if (currentSort.desc) {
        setSorting(sorting.filter((sort) => sort.id !== columnId));
      } else {
        setSorting([{ id: columnId, desc: true }]);
      }
    } else {
      setSorting([{ id: columnId, desc: false }]);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableColumnOrdering: true,
    enableColumnVisibility: true,
    enableGrouping: true,
    enablePagination: true,
    state: {
      grouping: groupByColumns,
      sorting: sorting,
      columnVisibility: columnVisibility, 
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: { sorting: [{ id: "id", desc: false }] },
  });

  return (
    <div>
      <Box
        alignItems="center"
        justifyContent="flex-end"
        mr={"20px"}
        display="flex"
      >
        <p style={{ fontWeight: "600" }}>Filters:</p>
        <Button
          sx={{ fontSize: "12px", color: "#6c6a6a", minWidth: "0" }}
          onClick={() =>
            setDrawerContainer({ filterType: "sort", isDrawerOpen: true })
          }
        >
          <SwapVertIcon />
        </Button>
        <Button
          sx={{ fontSize: "12px", color: "#6c6a6a", minWidth: "0" }}
          onClick={() =>
            setDrawerContainer({ filterType: "group", isDrawerOpen: true })
          }
        >
          <WorkspacesIcon />
        </Button>
        <Button
          sx={{ fontSize: "12px", color: "#6c6a6a", minWidth: "0" }}
          onClick={() =>
            setDrawerContainer({ filterType: "visibility", isDrawerOpen: true })
          }
        >
          <VisibilityOutlinedIcon />
        </Button>
        <Button
          sx={{ fontSize: "12px", color: "#6c6a6a", minWidth: "0" }}
          onClick={() =>
            setDrawerContainer({ filterType: "filter", isDrawerOpen: true })
          }
        >
          <FilterListOutlinedIcon />
        </Button>
      </Box>

      <Drawer
        anchor="right"
        open={drawerContainer.isDrawerOpen}
        onClose={() =>
          setDrawerContainer((prev) => ({ ...prev, isDrawerOpen: false }))
        }
      >
        <Box p={"14px"} width={360} role="presentation">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={"20px"}
          >
            <Typography variant="h6">
              {DrawerTitle(drawerContainer.filterType)}
            </Typography>
            <Box
              onClick={() =>
                setDrawerContainer((prev) => ({ ...prev, isDrawerOpen: false }))
              }
            >
              <CloseIcon />
            </Box>
          </Box>
          <Divider />

          {drawerContainer.filterType === "filter" && (
            <>
              <Box
                sx={{
                  border: "1px solid #e9e7e7",
                  borderRadius: "5px",
                  padding: "5px",
                  margin: "5px 0px",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Name</Typography>
                  <IconButton
                    onClick={() => setNameFilter("")}
                    aria-label="refresh name filter"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Search by name"
                />
              </Box>

              <Box
                sx={{
                  border: "1px solid #e9e7e7",
                  borderRadius: "5px",
                  padding: "5px",
                  margin: "5px 0px",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <InputLabel>Category</InputLabel>
                  <IconButton
                    onClick={() => setCategoryFilter([])}
                    aria-label="refresh category filter"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.length === 0
                          ? "Select categories"
                          : selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                      </Box>
                    )}
                  >
                    <MenuItem disabled value="">
                      <em>Select value</em> 
                    </MenuItem>
                    {categoryList.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Subcategory Filter */}
              <Box
                sx={{
                  border: "1px solid #e9e7e7",
                  borderRadius: "5px",
                  padding: "5px",
                  margin: "5px 0px",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <InputLabel>Sub Category</InputLabel>
                  <IconButton
                    onClick={() => setSubcategoryFilter([])}
                    aria-label="refresh subcategory filter"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={subcategoryFilter}
                    onChange={(e) => setSubcategoryFilter(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.length === 0
                          ? "Select subcategories"
                          : selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                      </Box>
                    )}
                  >
                    <MenuItem disabled value="">
                      <em>Select value</em>
                    </MenuItem>
                    {subcategoryList.map((subcategory) => (
                      <MenuItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* CreatedAt Date Range Picker */}
              <Box
                sx={{
                  border: "1px solid #e9e7e7",
                  borderRadius: "5px",
                  padding: "5px",
                  margin: "5px 0px",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Created At</Typography>
                  <IconButton
                    onClick={() => setCreatedAtRange([null, null])}
                    aria-label="refresh created at range"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateRangePicker"]}>
                    <DateRangePicker
                      startText="Created At"
                      endText="To"
                      value={createdAtRange}
                      onChange={(newValue) => setCreatedAtRange(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>

              {/* UpdatedAt Date Range Picker */}
              <Box
                sx={{
                  border: "1px solid #e9e7e7",
                  borderRadius: "5px",
                  padding: "5px",
                  margin: "5px 0px",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Updated At</Typography>
                  <IconButton
                    onClick={() => setUpdatedAtRange([null, null])}
                    aria-label="refresh updated at range"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateRangePicker"]}>
                    <DateRangePicker
                      startText="Updated At"
                      endText="To"
                      value={updatedAtRange}
                      onChange={(newValue) => setUpdatedAtRange(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>

              <Box
                sx={{
                  border: "1px solid #e9e7e7",
                  borderRadius: "5px",
                  padding: "5px",
                  margin: "5px 0px",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Price</Typography>
                  <IconButton
                    onClick={() => setPriceRange([0, maxPrice.price])}
                    aria-label="refresh price range"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <Slider
                  value={priceRange}
                  min={0}
                  max={maxPrice.price}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="on"
                  marks={[
                    { value: 0, label: "0" },
                    { value: maxPrice.price, label: `${maxPrice.price}` },
                  ]}
                />
              </Box>

              <Box
                sx={{
                  border: "1px solid #e9e7e7", 
                  borderRadius: "5px",
                  padding: "5px",
                  margin: "5px 0px",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Sale Price</Typography>
                  <IconButton
                    onClick={() => setSalePriceRange([0, maxPrice.sale_price])}
                    aria-label="refresh sale price range"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <Slider
                  value={salePriceRange}
                  min={0}
                  max={maxPrice.sale_price}
                  onChange={(e, newValue) => setSalePriceRange(newValue)}
                  valueLabelDisplay="on"
                  marks={[
                    { value: 0, label: "0" },
                    {
                      value: maxPrice.sale_price,
                      label: `${maxPrice.sale_price}`,
                    },
                  ]}
                />
              </Box>
            </>
          )}

          {/* Column Visibility - Toggle using Switch */}
          {drawerContainer.filterType === "visibility" && (
            <>
              <List>
                {columns.map((column) => (
                  <ListItem key={column.accessorKey}>
                    <ListItemText primary={column.header} />
                    <Switch
                      checked={columnVisibility[column.accessorKey] !== false}
                      onChange={(e) =>
                        setColumnVisibility({
                          ...columnVisibility,
                          [column.accessorKey]: e.target.checked,
                        })
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                onClick={() => setColumnVisibility([])}
                variant="outlined"
                sx={{ mt: 5 }}
                fullWidth
              >
                Show all columns
              </Button>
            </>
          )}

          {/* Grouping Controls */}
          {drawerContainer.filterType === "group" && (
            <Box mb={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  multiple
                  value={groupByColumns}
                  onChange={(e) => handleGroupBy(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  fullWidth
                >
                  {["Category", "Subcategory"].map((category) => (
                    <MenuItem key={category} value={category.toLowerCase()}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                onClick={() => setGroupByColumns([])}
                variant="outlined"
                sx={{ mt: 5 }}
                fullWidth
              >
                Clear Groupong{" "}
              </Button>
            </Box>
          )}

          {drawerContainer.filterType === "sort" && (
            <Box mt="20px" display="flex" flexDirection="column">
              {columns.map((column) => (
                <Button
                  key={column.accessorKey}
                  onClick={() => handleSorting(column.accessorKey)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "black",
                  }}
                >
                  {column.header}
                  {sorting.some((sort) => sort.id === column.accessorKey) &&
                  sorting.find((sort) => sort.id === column.accessorKey)
                    .desc ? (
                    <ArrowDownward />
                  ) : (
                    <ArrowUpward />
                  )}
                </Button>
              ))}
              <Button
                onClick={() => setSorting([{ id: "id", desc: false }])}
                variant="outlined"
                sx={{ mt: 5 }}
                fullWidth
              >
                Clear Sort{" "}
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <MaterialReactTable table={table} />
    </div>
  );
}

export default TableView;
