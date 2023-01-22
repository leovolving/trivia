import { Button, CircularProgress } from "@mui/material";

const LoadingButton = ({ isLoading, disabled, children, ...rest }) => {
  return (
    <Button
      disabled={isLoading || disabled}
      sx={{ position: "relative" }}
      {...rest}
    >
      <>
        {isLoading && (
          <CircularProgress size={24} sx={{ position: "absolute" }} />
        )}
        {children}
      </>
    </Button>
  );
};

export default LoadingButton;
