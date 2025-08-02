import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import BranchList from "./BranchList";

// Mock Redux store
const mockStore = configureStore([]);

// Mock data for Redux state
const initialState = {
  common: {
    loading: false,
    branches: [
      {
        serialNumber: 1,
        createdAt: "2023-01-01",
        BranchName: "Branch 1",
        _id: 1,
      },
      // Add more sample branches if needed
    ],
    signinuser: {
      UserType: 1,
    },
    admins: [
      {
        Name: "Admin 1",
        _id: "admin1",
        active: true,
      },
      // Add more sample admins if needed
    ],
  },
};

// Mock Redux actions
const mockDispatch = jest.fn();

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock Chakra UI components
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: jest.fn(),
}));

describe("BranchList component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it("renders the component without crashing", () => {
    render(
      <Provider store={store}>
        <BranchList />
      </Provider>
    );
    // You can add more specific assertions based on your component structure
    expect(screen.getByText("Branch Name")).toBeInTheDocument();
  });

  it("displays branches correctly", () => {
    render(
      <Provider store={store}>
        <BranchList />
      </Provider>
    );
    // You can add more specific assertions based on your component structure
    expect(screen.getByText("Branch 1")).toBeInTheDocument();
  });

  // Add more test cases based on specific functionalities (e.g., handleDelete, navigation, etc.)

  it("calls handleDelete when delete button is clicked", async () => {
    render(
      <Provider store={store}>
        <BranchList />
      </Provider>
    );

    // Mock the delete action
    mockDispatch.mockReturnValueOnce(Promise.resolve());

    // Click the delete button
    userEvent.click(screen.getByText("Delete"));

    // Wait for the delete action to be called
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));

    // You can add more specific assertions based on your component behavior
  });
});
