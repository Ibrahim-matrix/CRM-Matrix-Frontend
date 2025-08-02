import { Flex } from "@chakra-ui/react"
import Facebook from "./components/Facebook"
import IndiaMart from "./components/IndiaMart"
import JustDial from "./components/JustDial"

const SocialIntegration = () => {
  return (
    <div>
        <Flex justifyContent="space-around" alignItems="center" pt={'6rem'}>
        <IndiaMart />
        <Facebook />
        <JustDial/>
        </Flex>
        
    </div>
  )
}

export default SocialIntegration