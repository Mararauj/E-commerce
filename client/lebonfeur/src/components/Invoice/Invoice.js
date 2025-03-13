import React, { Fragment } from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { fontSize: 11, paddingTop: 20, paddingLeft: 40, paddingRight: 40, lineHeight: 1.5, flexDirection: 'column' },

    spaceBetween: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: "#3E3E3E" },

    titleContainer: { flexDirection: 'row', marginTop: 24 },
    
    logo: { width: 150 },

    reportTitle: { fontSize: 16, textAlign: 'center' },

    addressTitle: { fontSize: 11, fontStyle: 'bold' }, 
    
    invoice: { fontWeight: 'bold', fontSize: 17 },
    
    invoiceNumber: { fontSize: 11, fontWeight: 'bold' }, 
    
    address: { fontWeight: 400, fontSize: 10 },
    
    theader: { marginTop: 20, fontSize: 10, fontStyle: 'bold', paddingTop: 4, paddingLeft: 7, flex: 1, height: 20, backgroundColor: '#DEDEDE', borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1, borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

    total: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1.5, borderColor: 'whitesmoke', borderBottomWidth: 1 },

    tbody2: { flex: 2, borderRightWidth: 1 }
});


const InvoiceDocument = ({ orderDetails }) => {

    const destinationArray = orderDetails.destination.split(';');

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.titleContainer}>
                    <View style={styles.spaceBetween}>
                        <Image style={styles.logo} src={"/logo.png"} />
                        <Text style={styles.reportTitle}>LeBonFeuxRouge</Text>
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <View style={styles.spaceBetween}>
                        <View>
                            <Text style={styles.invoice}>Facture</Text>
                            <Text style={styles.invoiceNumber}>Numéro de suivi : {orderDetails.trackingNumber}</Text>
                        </View>
                        <View>
                            <Text style={styles.addressTitle}>10 rue Léopold Bellan</Text>
                            <Text style={styles.addressTitle}>75002 Paris</Text>
                            <Text style={styles.addressTitle}>France</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <View style={styles.spaceBetween}>
                        <View style={{ maxWidth: 200 }}>
                            <Text style={styles.addressTitle}>Livrer à :</Text>
                            
                            <Text style={styles.address}>{destinationArray[0]}</Text>
                            <Text style={styles.address}>{destinationArray[1]}</Text>
                            <Text style={styles.address}>{destinationArray[2]}</Text>
                            <Text style={styles.address}>{destinationArray[3]}</Text>
                            
                        </View>
                        <Text style={styles.addressTitle}>{orderDetails.date}</Text>
                    </View>
                </View>

                <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
                    <View style={[styles.theader, styles.theader2]}>
                        <Text>Produits</Text>
                    </View>
                    <View style={styles.theader}>
                        <Text>Prix unitaire</Text>
                    </View>
                    <View style={styles.theader}>
                        <Text>Quantité</Text>
                    </View>
                    <View style={styles.theader}>
                        <Text>Montant</Text>
                    </View>
                </View>

                <Fragment>
                    {orderDetails.products.map((product, index) => (
                        <View key={index} style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={[styles.tbody, styles.tbody2]}>
                                <Text>{product.productName}</Text>
                            </View>
                            <View style={styles.tbody}>
                                <Text>{product.priceAtPurchase.toFixed(2)} €</Text>
                            </View>
                            <View style={styles.tbody}>
                                <Text>{product.quantity}</Text>
                            </View>
                            <View style={styles.tbody}>
                                <Text>{(product.quantity * product.priceAtPurchase).toFixed(2)} €</Text>
                            </View>
                        </View>
                    ))}
                </Fragment>

                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={styles.total}>
                        <Text>Livraison {orderDetails.delivery}</Text>
                    </View>
                    <View style={styles.total}>
                        <Text></Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text></Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text>{orderDetails.shippingCost.toFixed(2)} €</Text>
                    </View>
                </View>

                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={styles.total}>
                        <Text></Text>
                    </View>
                    <View style={styles.total}>
                        <Text></Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text>Total</Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text>{orderDetails.total} €</Text>
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <View style={styles.spaceBetween}>
                        <View>
                            <Text style={styles.invoiceNumber}>Moyen de paiement : {orderDetails.payment}</Text>
                        </View>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default InvoiceDocument;
