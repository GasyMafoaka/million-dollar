import { StyleSheet } from "react-native";

export const color1 = "#264653";

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  title: {
    fontSize: 30,
    fontFamily: "MoreSugar",
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  filterButton: {
    borderWidth: 2,
    borderColor: color1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  filterActive: {
    backgroundColor: color1,
  },
  filterText: {
    color: color1,
    fontFamily: "MoreSugar",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderWidth: 2,
    borderColor: color1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  textInput: {
    width: "90%",
    padding: 10,
    fontFamily: "MoreSugar",
  },
  button: {
    backgroundColor: color1,
    width: "80%",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 22,
    fontFamily: "MoreSugar",
  },
  card: {
    borderWidth: 2,
    borderColor: color1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    width: 300,
  },
  cardTitle: {
    fontFamily: "MoreSugar",
    fontSize: 18,
  },
  cardAmount: {
    fontFamily: "MoreSugar",
    fontSize: 16,
    color: color1,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  edit: {
    color: "#2a9d8f",
    fontFamily: "MoreSugar",
  },
  delete: {
    color: "red",
    fontFamily: "MoreSugar",
  },
});
