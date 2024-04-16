import { NETWORKS } from '../constants/Networks'
import { BRIDGE_NETWORKS } from '../constants/BridgeNetworks'

const assetsPath = '../../assets/'

const attention = require(assetsPath + 'Attention.png')
const logo = require(assetsPath + 'Sapphire.png')
const logoAnimated = require(assetsPath + 'SapphireAnimated.gif')
const logoWithFullText = require(assetsPath + 'LogoFullText.png')

const homeBackground1 = require(assetsPath + 'HomeBackground.jpg')
const homeBackground2 = require(assetsPath + 'HomeBackground2.jpg')
const homeBackground3 = require(assetsPath + 'HomeBackground3.jpg')

const homeBackground = () => {
  const backgrounds = [homeBackground1, homeBackground2, homeBackground3]
  const randomIndex = Math.floor(Math.random() * backgrounds.length)
  return backgrounds[randomIndex]
}

const hardhatNetworkLogo = require(assetsPath + 'NetworkLogoHardhat.png')
const sepoliaNetworkLogo = require(assetsPath + 'NetworkLogoSepolia.png')
const ethereumNetworkLogo = require(assetsPath + 'NetworkLogoEthereum.png')
const polygonNetworkLogo = require(assetsPath + 'NetworkLogoPolygon.png')

const networkLogo = (network: NETWORKS | BRIDGE_NETWORKS) => {
  switch (network) {
    case NETWORKS.LOCALHOST:
      return hardhatNetworkLogo
    case NETWORKS.SEPOLIA:
      return sepoliaNetworkLogo
    case BRIDGE_NETWORKS.AMOY:
      return polygonNetworkLogo
    default:
      return ethereumNetworkLogo
  }
}

const qrCode = require(assetsPath + 'QrCode.png')
const qrCodeSmall = require(assetsPath + 'QrCodeSmall.png')

const sendETH = require(assetsPath + 'SendETH.png')
const sendNFTsBaseChain = require(assetsPath + 'SendNFTsBaseChain.png')
const sendNFTsAmoy = require(assetsPath + 'SendNFTsAmoy.png')

const sendMATIC = require(assetsPath + 'SendMATIC.png')

const bridgeETHtoMATIC = require(assetsPath + 'BridgeETHtoMATIC.png')
const bridgeNFT = require(assetsPath + 'BridgeNFTtoMATIC.png')

const NFTPlaceholder = require(assetsPath + 'NFTPlaceholder.png')

export {
  attention,
  logo,
  logoAnimated,
  logoWithFullText,
  homeBackground,
  networkLogo,
  qrCode,
  qrCodeSmall,
  sendETH,
  sendMATIC,
  sendNFTsBaseChain,
  sendNFTsAmoy,
  bridgeETHtoMATIC,
  bridgeNFT,
  NFTPlaceholder,
}
