"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Estimate = {
  low: number;
  high: number;
  summary: string;
  caveat: string;
};

declare global {
  interface Window {
    google?: typeof google;
  }
}

const URGENCY_OPTIONS = [
  { value: "before-next-guest", label: "Before next guest arrives" },
  { value: "this-week", label: "Sometime this week" },
  { value: "no-rush", label: "No rush — next available" },
];

export default function RequestPage() {
  const [description, setDescription] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [urgency, setUrgency] = useState(URGENCY_OPTIONS[0].value);
  const [photos, setPhotos] = useState<string[]>([]);

  const addressContainerRef = useRef<HTMLDivElement>(null);
  const [mapsAvailable, setMapsAvailable] = useState(false);

  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [estimating, setEstimating] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load the Google Maps Places script once and mount the new
  // PlaceAutocompleteElement web component into the address field's
  // container. The older `Autocomplete` widget is deprecated for any
  // Places API enabled after March 2025, so this uses its replacement.
  // If no API key is configured, the field falls back to a plain text input.
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !addressContainerRef.current) return;

    function initAutocomplete() {
      const container = addressContainerRef.current;
      const placesLib = window.google?.maps?.places as
        | (typeof google.maps.places & {
            PlaceAutocompleteElement?: new (opts?: object) => HTMLElement;
          })
        | undefined;
      if (!placesLib?.PlaceAutocompleteElement || !container) return;
      if (container.childElementCount > 0) return; // already mounted

      const placeAutocomplete = new placesLib.PlaceAutocompleteElement({
        includedRegionCodes: ["us"],
      });
      placeAutocomplete.classList.add("w-full");
      container.appendChild(placeAutocomplete);
      setMapsAvailable(true);

      placeAutocomplete.addEventListener("gmp-select", async (event: Event) => {
        const detail = event as unknown as {
          placePrediction: { toPlace: () => { fetchFields: (opts: object) => Promise<void>; formattedAddress?: string } };
        };
        const place = detail.placePrediction.toPlace();
        await place.fetchFields({ fields: ["formattedAddress"] });
        setAddress(place.formattedAddress ?? "");
      });
    }

    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", initAutocomplete);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.onload = initAutocomplete;
    document.head.appendChild(script);
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 4 - photos.length);
    const readAsDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    const newPhotos = await Promise.all(files.map(readAsDataUrl));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 4));
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function getEstimate() {
    setEstimating(true);
    setEstimateError(null);
    setEstimate(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, images: photos }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEstimateError(data.error ?? "Couldn't generate an estimate.");
      } else {
        setEstimate(data);
      }
    } catch {
      setEstimateError("Couldn't reach the estimator. Check your connection.");
    } finally {
      setEstimating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) {
      setSubmitError("Please select or enter your address.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyName,
          address,
          contact,
          urgency,
          description,
          photos,
          estimate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong submitting your request.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="font-utility text-xs uppercase tracking-[0.2em] text-palm mb-4">
            Request received
          </p>
          <h1 className="font-display text-3xl text-shadow-green mb-4">
            Got it — we&apos;ll confirm the timing shortly.
          </h1>
          <p className="font-body text-shadow-green/70 mb-8">
            We review every request by hand. Expect a text or call to confirm
            a time before any work is scheduled.
          </p>
          <Link
            href="/"
            className="font-body font-semibold bg-rust text-sand px-6 py-3 rounded-sm hover:bg-rust-dark transition-colors inline-block"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-shadow-green/10 px-6 py-5 max-w-3xl w-full mx-auto">
        <Link
          href="/"
          className="font-display text-xl tracking-wide uppercase text-shadow-green"
        >
          Kaloha Repairs
        </Link>
      </header>

      <section className="px-6 py-12 max-w-3xl w-full mx-auto flex-1">
        <p className="font-utility text-xs uppercase tracking-[0.2em] text-palm mb-2">
          Submit a request
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-shadow-green mb-2">
          Tell us what needs fixing.
        </h1>
        <p className="font-body text-shadow-green/70 mb-10 max-w-xl">
          We&apos;ll review every request and confirm a time directly with
          you — nothing is auto-booked.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Property name or unit">
              <input
                required
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g. Maui Sands #204"
                className={inputClasses}
              />
            </Field>
            <Field label="Address in Kihei">
              <div ref={addressContainerRef} className={mapsAvailable ? "gmp-field" : "hidden"} />
              {!mapsAvailable && (
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className={inputClasses}
                />
              )}
            </Field>
          </div>

          <Field label="Best way to reach you">
            <input
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone or email"
              className={inputClasses}
            />
          </Field>

          <Field label="How urgent is this?">
            <div className="flex flex-wrap gap-3">
              {URGENCY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setUrgency(opt.value)}
                  className={`font-body text-sm px-4 py-2 rounded-sm border transition-colors ${
                    urgency === opt.value
                      ? "bg-shadow-green text-sand border-shadow-green"
                      : "border-shadow-green/20 text-shadow-green/70 hover:border-rust hover:text-rust"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="What's wrong?">
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Bathroom faucet has been dripping steadily for a few days, and the lanai screen door won't slide smoothly."
              rows={4}
              className={inputClasses}
            />
          </Field>

          <Field label="Photos (optional, up to 4)">
            <div className="flex flex-wrap gap-3">
              {photos.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <div key={i} className="relative w-20 h-20">
                  <img
                    src={src}
                    alt={`Upload ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-sm border border-shadow-green/20"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                    className="absolute -top-2 -right-2 w-5 h-5 bg-shadow-green text-sand rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {photos.length < 4 && (
                <label className="w-20 h-20 border border-dashed border-shadow-green/30 rounded-sm flex items-center justify-center cursor-pointer text-shadow-green/50 hover:border-rust hover:text-rust transition-colors text-xs font-body text-center">
                  + Add
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </Field>

          {/* AI Estimate */}
          <div className="bg-palm/10 border border-palm/20 rounded-sm p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-utility text-xs uppercase tracking-[0.2em] text-palm mb-1">
                  Optional
                </p>
                <p className="font-body text-sm text-shadow-green/80">
                  Want a rough cost range before submitting?
                </p>
              </div>
              <button
                type="button"
                onClick={getEstimate}
                disabled={estimating || description.trim().length < 5}
                className="font-body text-sm font-semibold bg-shadow-green text-sand px-5 py-2.5 rounded-sm disabled:opacity-40 hover:bg-shadow-green/90 transition-colors whitespace-nowrap"
              >
                {estimating ? "Estimating…" : "Get AI estimate"}
              </button>
            </div>

            {estimateError && (
              <p className="font-body text-sm text-rust mt-4">{estimateError}</p>
            )}

            {estimate && (
              <div className="mt-5 pt-5 border-t border-palm/20">
                <p className="font-display text-2xl text-shadow-green">
                  ${estimate.low.toLocaleString()} – $
                  {estimate.high.toLocaleString()}
                </p>
                <p className="font-body text-sm text-shadow-green/70 mt-2">
                  {estimate.summary}
                </p>
                <p className="font-utility text-xs text-shadow-green/50 mt-3">
                  {estimate.caveat}
                </p>
              </div>
            )}
          </div>

          {submitError && (
            <p className="font-body text-sm text-rust">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="font-body font-semibold bg-rust text-sand px-6 py-3 rounded-sm hover:bg-rust-dark transition-colors disabled:opacity-50 self-start"
          >
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-body text-sm font-semibold text-shadow-green">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClasses =
  "font-body text-sm bg-sand border border-shadow-green/20 rounded-sm px-4 py-3 text-shadow-green placeholder:text-shadow-green/40 focus:outline-none focus:border-rust transition-colors";
