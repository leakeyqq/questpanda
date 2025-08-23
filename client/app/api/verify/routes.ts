import { SelfBackendVerifier, DefaultConfigStore, AllIds } from '@selfxyz/core';

const configStore = new DefaultConfigStore({
  minimumAge: 18,
  excludedCountries: ['IRN', 'PRK'],
  ofac: true
});

const verifier = new SelfBackendVerifier(
  'myservice-prod',  // Same scope as frontend
  `${process.env.NEXT_PUBLIC_URL}/api/verify`,
  false,  // Production mode
  AllIds,  // Accept all document types
  configStore,
  'hex'  // User ID type
);

export async function POST(request: Request) {
  const { attestationId, proof, pubSignals, userContextData } = await request.json();
  
  try {
    const result = await verifier.verify(
      attestationId,
      proof,
      pubSignals,
      userContextData
    );
    
    if (result.isValidDetails.isValid && result.isValidDetails.isMinimumAgeValid) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verification/success`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userCountry: result.discloseOutput.nationality,
        })
      })
      return Response.json({
        verified: true,
        age_verified: true,
        nationality: result.discloseOutput.nationality
      });
    }
    
    return Response.json({ verified: false }, { status: 400 });
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  return Response.json({ error: errorMessage }, { status: 500 });
}
}