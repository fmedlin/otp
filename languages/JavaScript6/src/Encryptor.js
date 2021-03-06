import stream from "stream"
import keyPair from "./keyPair"

class Encryptor extends stream.Transform {

  constructor(key) {
    super()
    this.key = key
  }

  obfuscate(message, i = 0) {
    let [ head, ...tail ] = message

    // Convert the character to its ASCII representation (so 'a' becomes 97)
    let code = head.charCodeAt()

    // Pull off two characters from the key and convert them to a hex number
    // (so '00' becomes 0, 'ff' becomes 255)
    let pair = keyPair(this.key, i)

    // XOR the results of the above and print out the resulting number in hex
    let result = (code ^ pair).toString(16)

    return tail.length ? result + this.obfuscate(tail, i + 2) : result
  }

  _transform(chunk, encoding, done) {
    var secret = this.obfuscate(chunk.toString())

    this.push(secret)

    done()
  }

}

export default Encryptor
