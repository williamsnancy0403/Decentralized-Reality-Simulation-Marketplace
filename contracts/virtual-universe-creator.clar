;; virtual-universe-creator

(define-map universes
  { universe-id: uint }
  {
    name: (string-utf8 100),
    creator: principal,
    physics-constants: (list 10 int),
    creation-time: uint,
    active: bool
  }
)

(define-data-var last-universe-id uint u0)

(define-public (create-universe (name (string-utf8 100)) (physics-constants (list 10 int)))
  (let
    (
      (new-id (+ (var-get last-universe-id) u1))
    )
    (map-set universes
      { universe-id: new-id }
      {
        name: name,
        creator: tx-sender,
        physics-constants: physics-constants,
        creation-time: block-height,
        active: true
      }
    )
    (var-set last-universe-id new-id)
    (ok new-id)
  )
)

(define-read-only (get-universe (universe-id uint))
  (map-get? universes { universe-id: universe-id })
)

(define-public (deactivate-universe (universe-id uint))
  (let
    (
      (universe (unwrap! (get-universe universe-id) (err u404)))
    )
    (asserts! (is-eq (get creator universe) tx-sender) (err u403))
    (map-set universes
      { universe-id: universe-id }
      (merge universe { active: false })
    )
    (ok true)
  )
)

