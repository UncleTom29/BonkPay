const { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

const connection = new Connection(process.env.SOLANA_CLUSTER);

exports.createBonkTransaction = async (payerPublicKey, recipientPublicKey, amountBonk) => {
  const mintPublicKey = new PublicKey(process.env.BONK_MINT_ADDRESS);
  const payerTokenAccount = await Token.getAssociatedTokenAddress(
    mintPublicKey,
    payerPublicKey,
    false
  );
  const recipientTokenAccount = await Token.getAssociatedTokenAddress(
    mintPublicKey,
    recipientPublicKey,
    false
  );

  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      payerTokenAccount,
      recipientTokenAccount,
      payerPublicKey,
      [],
      amountBonk
    )
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [payerPublicKey]);
  return signature;
};
