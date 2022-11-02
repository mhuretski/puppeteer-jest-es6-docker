export const productResponseMask = (json: any) =>
    json['S:Envelope']['S:Body'][0]['ns3:addProductResponse'][0].response[0]
