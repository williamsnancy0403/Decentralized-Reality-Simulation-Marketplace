;; experience-licensor

(define-map licenses
  { license-id: uint }
  {
    universe-id: uint,
    owner: principal,
    expiration: uint,
    transferable: bool
  }
)

(define-data-var last-license-id uint u0)

(define-public (issue-license (universe-id uint) (recipient principal) (duration uint) (transferable bool))
  (let
    (
      (new-id (+ (var-get last-license-id) u1))
      (universe (unwrap! (contract-call? .virtual-universe-creator get-universe universe-id) (err u404)))
    )
    (asserts! (is-eq (get creator universe) tx-sender) (err u403))
    (map-set licenses
      { license-id: new-id }
      {
        universe-id: universe-id,
        owner: recipient,
        expiration: (+ block-height duration),
        transferable: transferable
      }
    )
    (var-set last-license-id new-id)
    (ok new-id)
  )
)

(define-read-only (get-license (license-id uint))
  (map-get? licenses { license-id: license-id })
)

(define-public (transfer-license (license-id uint) (new-owner principal))
  (let
    (
      (license (unwrap! (get-license license-id) (err u404)))
    )
    (asserts! (is-eq (get owner license) tx-sender) (err u403))
    (asserts! (get transferable license) (err u403))
    (asserts! (> (get expiration license) block-height) (err u400))
    (map-set licenses
      { license-id: license-id }
      (merge license { owner: new-owner })
    )
    (ok true)
  )
)

