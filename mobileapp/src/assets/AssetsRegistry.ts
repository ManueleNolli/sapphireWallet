import { NETWORKS } from '../constants/Networks'

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

const networkLogo = (network: NETWORKS) => {
  switch (network) {
    case NETWORKS.LOCALHOST:
      return hardhatNetworkLogo
    case NETWORKS.SEPOLIA:
      return sepoliaNetworkLogo
    default:
      return ethereumNetworkLogo
  }
}

const qrCode = require(assetsPath + 'QrCode.png')
const sendETH = require(assetsPath + 'SendETH.png')
const sendNFTs = require(assetsPath + 'SendNFTs.png')

const NFTPlaceholder = require(assetsPath + 'NFTPlaceholder.png')

export {
  attention,
  logo,
  logoAnimated,
  logoWithFullText,
  homeBackground,
  networkLogo,
  qrCode,
  sendETH,
  sendNFTs,
  NFTPlaceholder,
}
