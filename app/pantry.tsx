import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { getProductInfo } from '../src/services/product';
import { PantryItem } from '../src/types';

export default function PantryScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<PantryItem[]>([]);
  const [facing] = useState<CameraType>('back');
  const [isLoading, setIsLoading] = useState(false);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanning(false);
    setIsLoading(true);
    
    try {
      const productInfo = await getProductInfo(data);
      
      if (productInfo) {
        Alert.alert(
          "Product Found!",
          `${productInfo.name} by ${productInfo.brand}`,
          [
            {
              text: "Add to Pantry",
              onPress: () => {
                const newItem: PantryItem = {
                  id: Math.random().toString(),
                  barcode: data,
                  name: productInfo.name,
                  brand: productInfo.brand,
                  image: productInfo.image_url,
                  quantity: 1,
                  dateAdded: new Date(),
                };
                setScannedItems(prev => [...prev, newItem]);
              }
            },
            {
              text: "Cancel",
              style: "cancel"
            }
          ]
        );
      } else {
        Alert.alert("Product Not Found", "This product isn't in our database.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch product information.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.emptyText}>We need camera access to scan barcodes</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={requestPermission}
          >
            <Text style={styles.scanButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {scanning ? (
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            barcodeScannerEnabled={true}
            onBarcodeScanned={handleBarCodeScanned}
          >
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setScanning(false)}
            >
              <FontAwesome name="close" size={24} color="white" />
            </TouchableOpacity>
          </CameraView>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Your Pantry</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <ScrollView style={styles.itemList}>
              {scannedItems.length > 0 ? (
                scannedItems.map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                    {item.image && (
                      <Image 
                        source={{ uri: item.image }} 
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    )}
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.brand && (
                        <Text style={styles.itemBrand}>{item.brand}</Text>
                      )}
                      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No items in your pantry yet</Text>
              )}
            </ScrollView>
          )}
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => setScanning(true)}
          >
            <FontAwesome name="barcode" size={24} color="white" />
            <Text style={styles.scanButtonText}>Scan Item</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 24,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  itemList: {
    flex: 1,
    marginBottom: 80, // Space for scan button
  },
  itemCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  itemBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
  },
}); 