import React from "react";
import { FlatList, View , Text, ActivityIndicator} from "react-native";
import { useListTransactionContext } from "../context/listTransactionContext";


const ListTransactionPage = ()=>{
    const {
        listTransaction,
        loading,
        fetchData,
        hasMore}  = useListTransactionContext();

    return (
    <View>
      <FlatList
        data={listTransaction}
        keyExtractor={(item : any) => item.id.toString()}
        renderItem={({ item } : { item : any}) => (
          <View>
            <View>
              <Text>{item.title}</Text>
            </View>
            <View>
               <Text>{item.body}</Text>
            </View>
          </View>
        )}
        onEndReached={()=>{
            if(!loading && hasMore){
                fetchData()
            }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
}

export default ListTransactionPage;